> # MS-Task
> 
 
## Description
 
MS-Task is a Node.js wrapper for Microsoft Windows' [tasklist](https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/tasklist.mspx?mfr=true) and [taskkill](http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/taskkill.mspx?mfr=true). Tasklist "displays a list of applications and services with their Process ID (PID) for all tasks running on either a local or a remote computer." Taskkill "ends one or more tasks or processes." Supported versions: Windows XP, Vista, 7, and 8. 
 
## Installation
 
You may install MS-Task via Node Package Manager as follows: 
 
    npm install ms-task 
 
The source code is available on [GitHub](https://github.com/mjhasbach/MS-Task). 
 
## Commands
 
Process names passed to MS-Task are not case-sensitive, but must contain the file extension (e.g. "exe"). All task finding functions will fail if tasklist.exe is not located in C:\Windows\System32, and ```task.kill``` will fail if taskkill.exe is not located in C:\Windows\System32. 
 
    var task = require('ms-task'); 
    task(arg, callback(err, data){}); 
Call tasklist.exe with the supplied arguments. Valid arguments are documented [here](https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/tasklist.mspx?mfr=true). Be sure to use nested or escaped quotes when necessary in the argument. The callback will contain ```err``` and ```data``` variables. ```Data``` is table, list, or CSV string of information about a matched process or processes, depending on the arguments supplied. Choosing CSV and using [node-csv](https://github.com/wdavidw/node-csv) is an easy way to deal with the resulting data. 
 
    task.procStat(proc, callback(err, data, amount){}); 
Search for a given process name or PID (```proc```). ```Err``` is null if a process was found. ```Data``` is an object which contains information (process name, PID, session name, session number, and memory usage) about a matched process or processes. It has two properties, ```array``` (an array of arrays) and ```object``` (an array of objects), which are essentially two different ways of accessing the same data.  The properties of ```data.object``` are name, pid, sessionName, sessionNumber, and memUsage. For example, to find the memory usage of the first process found, you could use ```data.array[0][4]``` or ```data.object[0].memUsage```. ```Amount``` is an integer representation of the amount of processes found; it is provided for convenience and is equivalent to ```data.array.length```. 
 
    task.pidOf(procName, callback(err, data, amount){}); 
Search for one or more PIDs that match a give process name (```procName```). ```Err``` is null if a PID was found. ```Data``` is an array of matched PIDs.  For example, the PID of the first process found would be ```data[0]```. ```Amount``` is an integer representation of the amount of processes found; it is provided for convenience and is equivalent to ```data.array.length```. 
 
    task.nameOf(PID, callback(err, data){}); 
Search for the process name that corresponds with the supplied ```PID```. ```Err``` is null if a process name was found. ```Data``` is the matching process name. 
 
    task.kill(proc, callback(err){}); 
Kill a given process name or PID (```proc```). ```Err``` is null if a process name or PID was killed successfully. If a process name is passed for ```proc```, and multiple matches are found, all of the matches are killed. 
 
## Examples
 
See [test/test.js](https://github.com/mjhasbach/MS-Task/blob/master/test/test.js). Before running the test, be sure to: 
 
    cd test/ 
    npm install 
 
This will download the async module, which is required for the test, but not MS-Task itself. 
 
## Improving MS-Task
 
If you would like to contribute code, feel free to submit a [pull request](https://github.com/mjhasbach/MS-Task/pulls). Please report issues [here](https://github.com/mjhasbach/MS-Task/issues).
