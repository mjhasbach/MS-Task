// Before running this test, be sure to:
//
// cd test/
// npm install
//
// This will download the async module, which is required for the test, but not MS-Task itself

var task = require('../lib/ms-task'),
    async = require('async');

async.parallel([
    function(callback){
        task('/fi "IMAGENAME eq explorer.exe" /fo CSV', function(err, data) {
            if(err) throw err;
            console.log('task test');
            console.log(data);

            callback(null, null);
        });
    },
    function(callback){
        task.list('/fi "IMAGENAME eq explorer.exe" /fo CSV', function(err, data) {
            if(err) throw err;
            console.log('task.list test');
            console.log(data);

            callback(null, null);
        });
    },
    function(callback){
        task.procStat('explorer.exe', function(err, data, amount) {
            if(err) throw err;
            console.log('task.procStat test');

            if(amount > 0) {
                console.log('One or more matching processes were found, here they are:');

                for (var x = 0; x < amount; x++) {
                    console.log('(From data.array)');
                    console.log('Process Name - ' + data.array[x][0]);
                    console.log('Process Number - ' + data.array[x][1]);
                    console.log('Session Name - ' + data.array[x][2]);
                    console.log('Session Number - ' + data.array[x][3]);
                    console.log('Memory Usage - ' + data.array[x][4]);
                }

                for (var y = 0; y < amount; y++) {
                    console.log('(From data.object)');
                    console.log('Process Name - ' + data.object[y].name);
                    console.log('Process Number - ' + data.object[y].pid);
                    console.log('Session Name - ' + data.object[y].sessionName);
                    console.log('Session Number - ' + data.object[y].sessionNumber);
                    console.log('Memory Usage - ' + data.object[y].memUsage);
                }
            } else {
                console.log("If Explorer isn't running on your PC, I can't help you :)")
            }

            console.log('');

            callback(null, null);
        });
    },
    function(callback){
        task.pidOf('explorer.exe', function(err, data, amount) {
            if(err) throw err;
            console.log('task.pidOf test');

            if(amount > 0) {
                console.log('One or more matching process numbers were found, here they are:');

                for (var i = 0; i < amount; i++) {
                    console.log(data[i]);
                }

                console.log('');
            } else {
                console.log("If Explorer isn't running on your PC, I can't help you :)")
            }

            callback(null, null);
        });
    },
    function(callback){
        task.nameOf(0, function(err, data) {
            console.log('task.nameOf test');

            if(err) {
                console.log("If System Idle Process isn't running on your PC, I can't help you :)")
            }
            else {
                console.log('A matching process name was found, here it is: ' + data);
            }

            console.log('');
            callback(null, null);
        });
    }
],

// Commit suicide when all of the above tasks have completed
function(){
    console.log('task.kill test (committing suicide)');
    task.kill(process.pid);
    // Exit code will be 1 if the suicide was successful
});









