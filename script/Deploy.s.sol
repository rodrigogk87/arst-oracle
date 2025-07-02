// script/Deploy.s.sol
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "../src/ARSUSDTOracle.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY"); // PRIVATE_KEY debe ser un número decimal sin 0x
        address router = vm.envAddress("FUNCTIONS_ROUTER");

        vm.startBroadcast(pk);

        ARSUSDTOracle oracle = new ARSUSDTOracle(router);

        console2.log("ARSUSDTOracle deployed at:", address(oracle));

        vm.stopBroadcast();
    }
}
