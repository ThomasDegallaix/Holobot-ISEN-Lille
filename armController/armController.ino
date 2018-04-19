#include <Servo.h>

/* Define global variables */
char command[50] = "";
const char* handshake ="handshake";
char tampon;
/* Define our servos */
Servo mg995_1; /* Define our servos */
Servo mg995_2;
Servo sg90;



/* Define the shake hand function */
void shake_hand() {
  //sg90.write(0);
  mg995_1.write(0);
  //mg995_2.write(0);
  delay(500);
  //sg90.write(90);
  mg995_1.write(45);
  //te(90);
  delay(500);
  memset(command, '\0', 50);
}


/* Setup the system */
void setup() {
  Serial.begin(9600);
  //sg90.attach(2);
  mg995_1.attach(3);
  //mg995_2.attach(4);
  pinMode(LED_BUILTIN, OUTPUT);
}


void loop() {
  /* Keep the interresting letters from the serial */
  if(0 < Serial.available()){
   int i=0;
    memset(command, '\0', 50);
    while(Serial.available() > 0){
      tampon = Serial.read();
      if(tampon!=13&&tampon!=10){
        command[i] = tampon;
        i++;
      }
    }
    
  }
  //WARNING: this delay is compulsory for the next test
  delay(300);
  /* Treating the data received from the Serial */
  if(!strcmp(command,"handshake")){
    Serial.println(command);
    shake_hand();    
  }    

}





