# MS-Task

### Description
 
MS-Task is a Node.js wrapper for Microsoft Windows' [tasklist](https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/tasklist.mspx?mfr=true) and [taskkill](http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/taskkill.mspx?mfr=true). Tasklist "displays a list of applications and services with their Process ID (PID) for all tasks running on either a local or a remote computer." Taskkill "ends one or more tasks or processes." Supported versions: Windows XP, Vista, 7, and 8. 
 
### Installation
 
You may install MS-Task via NPM as follows: 
 
    npm install ms-task 
 
The source code is available on [GitHub](https://github.com/mjhasbach/MS-Task). 
 
### Commands

#### task( ```argumentString```, callback( ```err```, ```processString``` ))

Call tasklist.exe with the supplied ```argumentString```. A valid ```argumentString``` is documented [here](https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/tasklist.mspx?mfr=true) and in the [test](https://github.com/mjhasbach/MS-Task/blob/master/test/test.js). Be sure to use nested or escaped quotes when necessary in the  ```argumentString```. The callback contains ```err``` and ```processString``` variables. ```err``` is null if no erros were encountered when calling tasklist.exe with the supplied ```argumentString```. ```processString``` is a table, list, or CSV string of information about a matched process or processes, depending on the supplied  ```argumentString```. Choosing CSV and using [node-csv](https://github.com/wdavidw/node-csv) is an easy way to deal with the resulting data. 

#### task.list(  ```argumentString```, callback( ```err```, ```processString``` ))

This convenience method is equivalent to ```task()```.

#### task.procStat( ```pidOrProcessName```, callback( ```err```, ```processes``` ))

Search for a given ```pidOrProcessName```. Both string and numeric PIDs are supported. ```err``` is null if one or more processes were found. ```processes``` is an object which contains information (process name, PID, session name, session number, and memory usage) about a matched process or processes. It has two properties, ```array``` (an array of arrays) and ```object``` (an array of objects).  The properties of ```processes.object``` are ```name```, ```pid```, ```sessionName```, ```sessionNumber```, and ```memUsage```. For example, to find the memory usage of the first process found, you could use ```processes.array[0][4]``` or ```processes.object[0].memUsage```.

#### task.pidOf( ```processName```, callback( ```err```, ```processes``` ))

Search for one or more PIDs that match a given ```processName```. ```err``` is null if one or more PIDs were found. ```processes``` is an array of matched PIDs.
 
#### task.nameOf( ```pid```, callback( ```err```, ```processName``` ))

Search for the ```processName``` that corresponds with the supplied integer or string ```pid```.```Err``` is null if a process name was found.
 
#### task.kill( ```proc```, callback( ```err```)) 

Kill a given process name or PID (```proc```). The callback is optional, and ```err``` is null if no erros were encountered when calling taskkill.exe with the supplied ```proc```. If a process name is passed for ```proc```, and multiple matches are found, all of the matches are killed.

### Test

    npm test
 
### Improving MS-Task
 
If you would like to contribute code, feel free to submit a [pull request](https://github.com/mjhasbach/MS-Task/pulls). Please report issues [here](https://github.com/mjhasbach/MS-Task/issues).