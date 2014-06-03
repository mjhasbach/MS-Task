var exec = require( 'child_process' ).exec,
    csv = require( 'csv' ),
    path = require( 'path' ),
    system32 = 'C:\\Windows\\System32',
    taskListPath = path.join( system32, 'tasklist.exe' ) + ' ',
    taskKillPath = path.join( system32, 'taskkill.exe' ) + ' ';

// Call tasklist.exe with the supplied arguments
// See https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/tasklist.mspx?mfr=true
function taskList( arg, callback ){
    exec( taskListPath + arg, function( err, stdout ){
        callback( err, stdout )
    })
}

// Search for one or more PIDs that match a give process name
function pidOf( procName, callback ){
    if ( isString( procName )){
        var pids = [];

        procStat( procName, function( err, processes ){
            processes.object.forEach( function( proc ){
                pids.push( proc.pid )
            });

            callback( err, pids )
        })
    } else callback( new Error( 'A non-string process name was supplied' ), null, null )
}

// Search for the process name that corresponds with the supplied PID
function nameOf( pid, callback ){
    if( isNumber( pid )){
        procStat( pid, function( err, proc ){
            callback( err, proc.object[ 0 ].name );
        })
    } else callback( new Error( 'A non-numeric PID was supplied' ), null )
}

// Search for a given process name or PID
function procStat( proc, callback ){
    var type = isNumber( proc ) ? 'PID' : 'IMAGENAME',
        arg = '/fi \"' + type + ' eq ' + proc + '\" /fo CSV',
        row = null,
        processes = {
            array: [],
            object: []
        };

    taskList( arg, function( err, stdout ){
        csv.parse( stdout, function( err, rows ){
            if ( rows.length > 0 ){
                for ( var i = 1; i < rows.length; i++ ){
                    row = rows[ i ];

                    processes.array.push( row );
                    processes.object.push({
                        name: row[ 0 ],
                        pid: row[ 1 ],
                        sessionName: row[ 2 ],
                        sessionNumber: row[ 3 ],
                        memUsage: row[ 4 ]
                    })
                }
            } else {
                var noun = isNumber( proc ) ? 'PIDs' : 'process names';
                err = new Error( 'There were no ' + noun + ' found when searching for \"' + proc + '\"' )
            }

            callback( err, processes )
        })
    })
}

// Kill a given process name or PID
function kill( proc, callback ){
    var arg = isNumber( proc ) ? '/F /PID ' + proc : '/F /IM ' + proc;

    if ( isNumber( proc ) || isString( proc )){
        exec( taskKillPath + arg, function( err ){
            if( callback ) callback( err )
        })
    } else {
        callback( new Error( 'The first kill() argument provided is neither a string nor an integer (not a valid process).' ))
    }
}

function isString( obj ){
    return Object.prototype.toString.call( obj ) == '[object String]'
}

function isNumber( obj ){
    return !isNaN( parseFloat( obj ))
}

module.exports = taskList;
module.exports.list = taskList;
module.exports.procStat = procStat;
module.exports.pidOf = pidOf;
module.exports.nameOf = nameOf;
module.exports.kill = kill;