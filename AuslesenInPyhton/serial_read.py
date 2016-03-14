import time
import serial
'''
Das Programm liest den String der vom Stromzähler ankommt und druckt es gleich mal aus.
Als Nächstes werde ich mir anschauen wie genau das mit dem redis Datenbank funktioniert.
'''
ser = serial.Serial(
      port = '/dev/ttyAMA0',
      baudrate = 9600,
      parity =serial.PARITY_NONE,
      stopbits=serial.STOPBITS_ONE,
      bytesize=serial.SEVENBITS,
      timeout = 1,
      )

while 1:
    time.sleep(3)
    x = ser.read(700)
    print x



