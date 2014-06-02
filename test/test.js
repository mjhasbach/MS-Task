var assert = require( 'assert' ),
    task = require( '../lib/ms-task' );

describe( 'MS-Task', function() {
    it( 'should be able to find Explorer using task()', function ( done ){
        task( '/fi "IMAGENAME eq explorer.exe" /fo CSV', function( err, data ){
            assert.equal( err, null );

            assert.equal( data.indexOf( 'explorer.exe' ) != -1, true );

            done()
        });
    });

    it( 'should be able to find Explorer using task.list()', function ( done ){
        task.list( '/fi "IMAGENAME eq explorer.exe" /fo CSV', function( err, data ){
            assert.equal( err, null );

            assert.equal( data.indexOf( 'explorer.exe' ) != -1, true );

            done()
        });
    });

    it( 'should be able to find Explorer using task.procStat()', function ( done ){
        task.procStat( 'explorer.exe', function( err, data ){
            assert.equal( err, null );

            assert.equal( data.array.length > 0, true );
            assert.equal( data.object.length > 0, true );

            data.array.forEach( function( proc ){
                assert.equal( proc[ 0 ].indexOf( 'explorer.exe' ) != -1, true );
                assert.equal( isNumber( proc[ 1 ]), true );
                assert.equal( isString( proc[ 2 ]), true );
                assert.equal( isNumber( proc[ 3 ]) > 0, true );
            });

            data.object.forEach( function( proc ){
                assert.equal( proc.name.indexOf( 'explorer.exe' ) != -1, true );
                assert.equal( isNumber( proc.pid ), true );
                assert.equal( isString( proc.sessionName ), true );
                assert.equal( isNumber( proc.sessionNumber) > 0, true );
            });

            done()
        });
    });

    it( 'should be able to find Explorer using task.pidOf()', function ( done ){
        task.pidOf( 'explorer.exe', function( err, pids ){
            assert.equal( pids.length > 0, true );

            pids.forEach( function( pid ){
                assert.equal( isNumber( pid ), true);
            });

            done()
        });
    });

    it( 'should be able to find System Idle Process using task.nameOf()', function ( done ){
        task.nameOf( 0, function( err, name ){
            assert.equal( name.indexOf( 'System Idle Process' ) != -1, true );

            done()
        });
    });

    it( 'should be able to kill a child process using task.kill()', function ( done ){
        var proc = require( 'child_process' ).spawn( 'cmd.exe' );

        proc.on( 'close', function() {
            done()
        });

        task.kill( proc.pid );
    });
});

function isString( obj ){
    return Object.prototype.toString.call( obj ) == '[object String]'
}

function isNumber( obj ){
    return !isNaN( parseFloat( obj ))
}