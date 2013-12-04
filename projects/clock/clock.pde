/**
 * Clock. 
 * 
 * The current time can be read with the second(), minute(), 
 * and hour() functions. In this example, sin() and cos() values
 * are used to set the position of the hands.
 */

int cx, cy;
int radius;
float secondsRadius;
float minutesRadius;
float hoursRadius;
float hourDiameter, minuteDiameter, secondDiameter;

void setup() {
  size(640, 440);
  stroke(0);
  
  radius = min(width, height) / 3;
  secondsRadius = radius * 0.229;
  secondDiameter = secondsRadius * 2;
  minutesRadius = radius * 0.371;
  minuteDiameter = minutesRadius * 2;
  hoursRadius = radius * 0.6;
  hourDiameter = hoursRadius * 2;
  
  cx = width / 2;
  cy = height / 2;
}

void draw() {
  background(230);
  
  // Angles for sin() and cos() start at 3 o'clock;
  // subtract HALF_PI to make them start at the top
  float s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  float m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI; 
  float h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;
  
  float hourX = cx + cos(h) * hoursRadius;
  float hourY = cy + sin(h) * hoursRadius;
  
  float minuteX = hourX + cos(m) * minutesRadius;
  float minuteY = hourY + sin(m) * minutesRadius;
  
  float secondX = minuteX + cos(s) * secondsRadius;
  float secondY = minuteY + sin(s) * secondsRadius;
  
  //Draw the clock background
  //fill(30)
  //nostroke();
  //rect(cx-radius-20,cy-radius-20,cx+radius+20,cy+radius+20);
  
  // Draw the hour background
  fill(0);
  stroke(30);
  ellipse(cx, cy, hourDiameter/1.61803398875, hourDiameter/1.61803398875);
  
  // Draw the minute background
  fill(10);
  stroke(30);
  ellipse(hourX, hourY, minuteDiameter/1.61803398875, minuteDiameter/1.61803398875);
  
  // Draw the second background
  fill(20);
  stroke(30);
  ellipse(minuteX, minuteY, secondDiameter/1.61803398875, secondDiameter/1.61803398875);
  
  //draw the second hand
  stroke(0,100,255);
  strokeWeight(1);
  line(minuteX, minuteY, secondX, secondY);
  
  //draw the minute hand
  stroke(0,255,0);
  strokeWeight(2);
  line(hourX, hourY, minuteX, minuteY);
  
  // Draw the hour hand
  stroke(255,0,0);
  strokeWeight(4);
  line(cx, cy, hourX, hourY );
}