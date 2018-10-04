pragma solidity ^0.4.24;

contract Deversi {

    string public myString = "Hello World2";
    event StringUpdated();

    function set(string x) public {
        myString = x;
        emit StringUpdated();
    }
}