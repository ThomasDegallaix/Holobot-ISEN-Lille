---------------- ARBOTIX PART ------------------
In this folder, you will find everything you need for driving the hexapod with the arbotix card.

INSTALLATION
For using the arbotix card with arduino, you need to put the ArbotiX Sketches in the Documents/Arduino folder, the hardware in the Documents/Arduino/hardware folder, and the librairies in the Documents/Arduino/librairies folder

SETTING DYNAMIXEL GEAR IDs
For setting the gear IDs, you have to transfer the ros sketch from the ArbotiX Sketches folder on the ArbotiX Card. Then, use the dynaManager14, which is only supported on windows for centering the engines and setting their IDs

ARDUINO CODE FOR THE HEXAPOD
The arduino code for the hexapod is in the Phantom_Phoenix folder. You just have to transfer it onto the ArbotiX card, when you correctly have set all the Dynamixel IDs

PILOT THE HEXAPOD
Finally, use the virtual commander in order to control the hexapod from virtual joysticks. ENJOY !