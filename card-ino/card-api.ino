#include <SPI.h>
#include <Ethernet.h>
#include <WiegandMulti.h>
WIEGANDMULTI wg;

String query;
byte mac[] = { 0x00, 0x1A, 0x2B, 0x3C, 0x4D, 0x5E };
EthernetClient client;
IPAddress serverIp(192, 168, 0, 103);
int puerto = 5555;
void Reader1D0Interrupt(void)
{
  wg.ReadD0();
}

void Reader1D1Interrupt(void)
{
  wg.ReadD1();
}

void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
  pinMode(5, OUTPUT);
  digitalWrite(5, LOW); 
  if (Ethernet.begin(mac) == 0) {
    return;
  }
	wg.begin(2,3,Reader1D0Interrupt,Reader1D1Interrupt);
  delay(1000);
  Serial.println("Todo inicializado");
}

//21610518
unsigned long cardData = 0;
void loop() {
    if (wg.available()) {
      digitalWrite(13, HIGH);
        cardData = (wg.getCode());
        Serial.println(cardData);
        bool flag = verificarTarjeta(cardData);
        if (flag) {
            Serial.println("TV");
            digitalWrite(5, HIGH); 
            delay(1000);                   
            digitalWrite(5, LOW);  
        } else {
            Serial.println("!TV");
        }
        insertarRegistro(cardData);
        digitalWrite(13, LOW);
    }
}


bool verificarTarjeta(unsigned long tarjeta) {
  String url = "/autorizado/" + String(tarjeta);
  if (client.connect(serverIp, puerto)) {
    client.print("GET " + url + " HTTP/1.1\r\n");
    client.print("Host: " + String(serverIp) + "\r\n");
    client.print("Connection: close\r\n\r\n");

    unsigned long timeout = millis();
    while (client.connected() && millis() - timeout < 3000) {
      while (client.available()) {
        char c = client.read();
        query += c;
      }
    }
    client.stop();
    if (query.indexOf("\"autorizado\": 1") != -1) {
      query = ""; // Limpiar la variable para la siguiente consulta
      return true;  // Tarjeta autorizada
    } else {
      query = ""; // Limpiar la variable para la siguiente consulta
      return false; // Tarjeta no autorizada
    }
  } else {
    Serial.println("Connection failed");
    return false;  // Error de conexión
  }
}

void insertarRegistro(uint32_t tarjeta) {
  String url = "/newlog";
  String jsonBody = "{\"rfid\":\"" + String(tarjeta) + "\"}";

  if (client.connect(serverIp, puerto)) {
    client.print("POST " + url + " HTTP/1.1\r\n");
    client.print("Host: " + String(serverIp) + "\r\n");
    client.print("Content-Type: application/json\r\n");
    client.print("Content-Length: " + String(jsonBody.length()) + "\r\n");
    client.print("Connection: close\r\n\r\n");
    client.print(jsonBody);

    unsigned long timeout = millis();
    while (client.connected() && millis() - timeout < 1000) {
      while (client.available()) {
        char c = client.read();
      }
    }
    client.stop();
  } else {
    Serial.println("Connection failed");
  }
}