var exec = require( 'child_process' ).exec,
    csv = require( 'csv' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    system32 = 'C:\\Windows\\System32',
    taskListPath = path.join( system32, 'tasklist.exe' ),
    taskKillPath = path.join( system32, 'taskkill.exe' );

// Call tasklist.exe with the supplied arguments
// See https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/tasklist.mspx?mfr=true
function taskList( arg, callback ){
    exec( cmdJoin( taskListPath, arg ), function( err, stdout ){
        callback( err, stdout )
    });
}

// Search for one or more PIDs that match a give process name
function pidOf( procName, callback ){
    if ( isString( procName )){
        var pids = [];

        procStat( procName, function( err, processes, amount ){
            processes.object.forEach( function( proc ){
                pids.push( proc.pid )
            });

            callback( err, pids, amount );
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
    var filter = isNumber( proc ) ? 'PID' : 'IMAGENAME',
        arg = '/fi \"' + filter + ' eq ' + proc + '\" /fo CSV',
        data = {
            array: [],
            object: []
        };

    fileExists( taskListPath, function( exists ){
        if( exists ){
            taskList( arg, function( err, stdout ){
                csv.parse( stdout, function( err, rows ){
                    if ( rows.length > 0 ){
                        rows.forEach( function( row ){
                            if ( row[ 0 ] !== 'Image Name'){
                                data.array.push( row );
                                data.object.push({
                                    name: row[ 0 ],
                                    pid: row[ 1 ],
                                    sessionName: row[ 2 ],
                                    sessionNumber: row[ 3 ],
                                    memUsage: row[ 4 ]
                                })
                            }
                        })
                    } else {
                        var noun = isNumber( proc ) ? 'PIDs' : 'process names';
                        err = new Error( 'There were no ' + noun + ' found when searching for \"' + proc + '\"' )
                    }

                    callback( err, data, data.array.length );
                });
            });
        } else {
            callback( new Error( taskListPath + ' could not be found!' ), null, null );
        }
    });
}

// Kill a given process name or PID
function kill( proc, callback ){
    var arg = isNumber( proc ) ? '/F /PID ' + proc : '/F /IM ' + proc;

    if ( isNumber( proc ) || isString( proc )){
        fileExists( taskKillPath, function( exists ){
            if ( exists ){
                exec( cmdJoin( taskKillPath, arg ), function( err ){
                    if( callback ) callback( err )
                })
            } else {
                callback( new Error( taskListPath + ' could not be found!' ))
            }
        })
    } else {
        callback( new Error( 'The first kill() argument provided is neither a string nor an integer (not a valid process).' ))
    }
}

function fileExists( path, callback ){
    fs.exists( path, function( exists ){
        callback( exists )
    });
}

function cmdJoin( cmd, params ){
    params = typeof params == 'undefined' ? '' : ' ' + params;
    return cmd + params
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