
char command[50];

void setup() {
  Serial.begin(115200);
  
}

void loop() {
  /*Serial.println("test");
  delay(1000);*/
  if (0 < Serial.available()) {
    memset(command, '\0', 50);
    Serial.readBytesUntil('\n', command, 50); // Input message from MQTT
    
    Serial.println(command); // Output message to MQTT
  }
 
}
