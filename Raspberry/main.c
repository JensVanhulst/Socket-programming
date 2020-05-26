#include <zmq.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <assert.h>
#include <string.h>
#include "zhelpers.h"
#include <wiringPi.h>

#define GREEN_LED 29
#define YELLOW_LED 28
#define RED_LED 27

int counter = 0;

int main (void)
{
    if(wiringPiSetup() == -1)
    {
        printf("Failed");
        return -1;
    }
    
    pinMode(GREEN_LED, OUTPUT);
    pinMode(YELLOW_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    
    // SUB = PUB poort = 24042 
    // 1) - "example>task!>"
    //     -> filter op naam
    // 2) - "example>answer!>"
    
    // Creates new ZMQ context and SUB.
    void *context = zmq_ctx_new ();
    void *subscriber = zmq_socket(context, ZMQ_SUB);

    // Make connection
    zmq_connect (subscriber, "tcp://193.190.154.184:24042");

    // Make topic    char* topic =  "example>task?>";
    // char* topic =  "example>task!>Kasper Toetenel>";
    char* topic =  "NP_KT_JV>raspberry>alerts>"; // example>answer?>
    zmq_setsockopt (subscriber, ZMQ_SUBSCRIBE, topic, 26);
    
    printf ("Connecting to Benternet…\n");
    
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(YELLOW_LED, HIGH);
    digitalWrite(RED_LED, HIGH);

    while(1)
    {
        //  Read message contents
        char *contents = s_recv (subscriber);
        printf ("%s\n", contents);
        
        counter++;
        
        if(counter == 1)
        {
            digitalWrite(GREEN_LED, LOW);
            digitalWrite(YELLOW_LED, HIGH);
            digitalWrite(RED_LED, HIGH);
        }
        
        else if(counter == 2)
        {
            digitalWrite(GREEN_LED, HIGH);
            digitalWrite(YELLOW_LED, LOW);
            digitalWrite(RED_LED, HIGH);
        }
        
        else if(counter == 3)
        {
            digitalWrite(GREEN_LED, HIGH);
            digitalWrite(YELLOW_LED, HIGH);
            digitalWrite(RED_LED, LOW);
            
            delay(10000);
            
            digitalWrite(GREEN_LED, HIGH);
            digitalWrite(YELLOW_LED, HIGH);
            digitalWrite(RED_LED, HIGH);
            
            counter = 0;
        }
        
        else
        {
            digitalWrite(GREEN_LED, HIGH);
            digitalWrite(YELLOW_LED, HIGH);
            digitalWrite(RED_LED, HIGH);
        }
        

        // Free all
        //free (address);
        free (contents);
    }

    zmq_close (subscriber);
    zmq_ctx_destroy (context);
    return 0;
}
