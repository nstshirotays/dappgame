// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PiyoPiyoCoin.sol";

contract GameCenter {

    uint constant public  MAP_SIZE = 50;
    uint constant private SHIP_WIDTH = 2;

    struct Missile {
        address owner;
        uint direction;     // 4:left  6:right   8:up 2:down
        uint x;             // Top Left is zero point
        uint y;
        bool live;          // flag  
    }

    struct Ship {
        address owner;
        uint direction;
        uint x;
        uint y;
        bool live;          // flag  
    }

    event Change2coin(address indexed user);
    event Sagitarius_start(address indexed user, uint x, uint y);
    event Sagitarius_move(address indexed user, uint direc);
    event Sagitarius_shot(address indexed user);
    event Sagitarius_rtb(address indexed user, uint balance);
    event Sagitarius_hit(address indexed from,address indexed to);
    event Sagitarius_end(address indexed user);



    Ship[] public ships;
    Missile[] public missiles;
    mapping (address => uint256) public piyo_balance;

    PiyoCoin private token;
    
    constructor(PiyoCoin _token)  {
        token = _token;
    }
    
    function getShipLength() public view  returns (uint) {
        return ships.length;
    }

    function getMissleLenght() public view returns (uint) {
        return missiles.length;
    }
    
    function change2coin() payable public {
        require(msg.value==1e17, 'We accept only 0.1 ETH');
        token.mint(msg.sender, 30*1e18);
        
        emit Change2coin(msg.sender);
    }
    

    // The day of Sagitarius III
    function sagitarius_start() public {
        require(token.transferFrom(msg.sender, address(this), 10*1e18), "require fail"); 

        uint seed;
        uint x;
        uint y;
        
        do {
            seed++;
            (x , y) = getRandomPosision(seed);
        } while( isExist(x,y));

        bool till=false;
        
        for( uint i=0; i < ships.length; i++) {
            if (!ships[i].live  && !till) {
                till=true;
                ships[i].owner = msg.sender;
                ships[i].direction =8;
                ships[i].x = x;
                ships[i].y = y;
                ships[i].live = true;
                break;
            }
        }
        if (!till) {
            Ship memory ship = Ship( msg.sender, 8, x, y, true);
            ships.push(ship);
        }        

        emit Sagitarius_start(msg.sender,x,y);

        piyo_balance[msg.sender] = 10;
        moveMissiles();
        moveMissiles();
        moveMissiles();
    }

    function sagitarius_move(uint direc) public {
        for( uint i=0; i < ships.length; i++) {
            if (ships[i].live && ships[i].owner == msg.sender) {
                uint nx=ships[i].x;
                uint ny=ships[i].y;

                ships[i].direction = direc;
                
                if (direc == 8) {ny--;}
                if (direc == 6) {nx++;}
                if (direc == 2) {ny++;}
                if (direc == 4) {nx--;}

                if (nx >= MAP_SIZE - SHIP_WIDTH ) { nx =  MAP_SIZE - SHIP_WIDTH -1;}
                if (ny >= MAP_SIZE - SHIP_WIDTH ) { ny =  MAP_SIZE - SHIP_WIDTH -1;}
                
                bool exist;
                for( uint j=0; j < ships.length; j++) {

                    if (ships[j].live && ships[j].owner != msg.sender) {
                        uint xw = absDiff( ships[i].x, ships[j].x);
                        uint yw = absDiff( ships[i].y, ships[j].y);

                        if ( xw < SHIP_WIDTH*2 && yw < SHIP_WIDTH*2) {
                            exist = true;
                        }
                    }
                }

                if (!exist) {
                    ships[i].x = nx;
                    ships[i].y = ny;
                }
                break;
            }
        }

        emit Sagitarius_move(msg.sender,direc);

        moveMissiles();
        moveMissiles();
        moveMissiles();
    }

    function sagitarius_shot() public {
        for( uint i=0; i < ships.length; i++) {
            if (ships[i].live && ships[i].owner == msg.sender) {
                uint x = ships[i].x;
                uint y = ships[i].y;
                
                if ( ships[i].direction == 8) { y = y - SHIP_WIDTH ;}
                if ( ships[i].direction == 6) { x = x + SHIP_WIDTH ;}
                if ( ships[i].direction == 2) { y = y + SHIP_WIDTH ;}
                if ( ships[i].direction == 4) { x = x - SHIP_WIDTH ;}

                bool till=false;
                
                for( uint j=0; j < missiles.length; j++) {
                    if (!missiles[j].live && !till) {
                        till=true;
                        missiles[j].owner = msg.sender;
                        missiles[j].direction =ships[i].direction;
                        missiles[j].x = x;
                        missiles[j].y = y;
                        missiles[j].live = true;
                        break;
                    }
                }
                if (!till) {
                    Missile memory missile = Missile( msg.sender, ships[i].direction, x, y, true);
                    missiles.push(missile);
                }        
            }
        }
        emit Sagitarius_shot(msg.sender);

        moveMissiles();
        moveMissiles();
        moveMissiles();
    }

    function sagitarius_rtb() public {
        for( uint j=0; j < missiles.length; j++) {
            if (!missiles[j].live && missiles[j].owner == msg.sender) {
                missiles[j].live = false;
            }
        }

        for( uint i=0; i < ships.length; i++) {
            if (ships[i].live && ships[i].owner == msg.sender) {
                ships[i].live = false;
                uint256 z = piyo_balance[msg.sender] ;
                piyo_balance[msg.sender] = 0;
                token.transfer(msg.sender, z * 1e18 );
                
                emit Sagitarius_rtb(msg.sender,z);
            }
        }

        moveMissiles();
        moveMissiles();
        moveMissiles();


   }


    function moveMissiles() private {
        for( uint i=0; i < missiles.length; i++) {
            if (missiles[i].live) {
                uint nx = missiles[i].x;
                uint ny = missiles[i].y;
                
                if ( missiles[i].direction == 8) { ny--; }
                if ( missiles[i].direction == 6) { nx++; }
                if ( missiles[i].direction == 2) { ny++; }
                if ( missiles[i].direction == 4) { nx--; }

                missiles[i].x = nx;
                missiles[i].y = ny;
                
                if (nx == 0 || ny == 0 || nx >= MAP_SIZE || ny >= MAP_SIZE) {
                    missiles[i].live = false;
                    break;
                }                

                 for( uint j=0; j < ships.length; j++) {
                    if (ships[j].live) {
                        uint xw = absDiff( nx, ships[j].x);
                        uint yw = absDiff( ny, ships[j].y);
                        if ( xw < SHIP_WIDTH && yw < SHIP_WIDTH) {
                            // HIT
                            missiles[i].live = false;
                            
                            piyo_balance[ships[j].owner]--;
                            piyo_balance[missiles[i].owner]++;
                            
                            emit Sagitarius_hit(missiles[i].owner,ships[j].owner);

                            if( piyo_balance[ships[j].owner] == 0 ) {
                                ships[j].live = false;
                                emit Sagitarius_end(ships[j].owner);
                            }
                            break;
                        }
                    }
                }               

            }
        }
    }

    function getRandomPosision(uint _seed) private view returns (uint,uint) {
        
        uint x = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,_seed))) % MAP_SIZE;
        _seed++;
        uint y = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,_seed))) % MAP_SIZE;

        return (x,y);
    }

    function isExist(uint _x,  uint _y) private view returns (bool) {
        bool ret = false;
        for( uint i=0; i < ships.length; i++) {
            if (ships[i].live) {
                uint xw = absDiff( _x, ships[i].x);
                uint yw = absDiff( _y, ships[i].y);
                if ( xw < SHIP_WIDTH*2 && yw < SHIP_WIDTH+2) {
                    ret = true;
                }
            }
        }
        return ret;
    }

    function absDiff(uint a, uint b) private pure returns (uint ) {
        uint ret;
        if (a > b) { ret = a-b ;}
        if (b > a) { ret = b-a ;}
        return ret;
    }
}