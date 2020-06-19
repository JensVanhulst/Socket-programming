#include <zmq.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <assert.h>
#include <string.h>
#include "zhelpers.h"
#include <wiringPi.h>

#define GREEN_LED 29
#define RED_LED 27

#define PUSH_BUTTON 28

int counter = 0;

int main (void)
{
    if(wiringPiSetup() == -1)
    {
        printf("Failed");
        return -1;
    }
    
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(PUSH_BUTTON, INPUT);
    
    // Creates new ZMQ context and SUB.
    void *context = zmq_ctx_new ();
    void *subscriber = zmq_socket(context, ZMQ_SUB);
    void *publisher = zmq_socket(context, ZMQ_PUB);

    // Make connection
    zmq_connect (subscriber, "tcp://193.190.154.184:24042");
    zmq_connect (publisher, "tcp://193.190.154.184:24041");

    char* topic = "EXK>NP_KT_JV>raspberry>tic-tac-toe>playerturn"; >
    zmq_setsockopt (subscriber, ZMQ_SUBSCRIBE, topic, 45);

    char* topic2 = "EXK>NP_KT_JV>raspberry>tic-tac-toe>pushbtn"; >
    zmq_setsockopt (publisher, ZMQ_PUBLISH, topic, 42);
    
    printf ("Connecting to Benternet…\n");
    
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(RED_LED, HIGH);
    digitalRead(PUSH_BUTTON);

    while(1)
    {
        //  Read message contents
        char *contents = s_recv (subscriber);
        printf ("%s\n", contents);
        
        counter++;
        if (digitalRead(PUSH_BUTTON) == 1)
        {
            zmq_setsockopt (publisher, ZMQ_PUBLISH, topic+"1", 42);
        }

        if(counter == 1)
        {
            digitalWrite(GREEN_LED, HIGH);
            digitalWrite(RED_LED, LOW);
        }
        
        else if(counter == 2)
        {
            digitalWrite(GREEN_LED, LED);
            digitalWrite(RED_LED, HIGH);
            counter = 0;
        }
        
        else
        {
            digitalWrite(GREEN_LED, LOW);
            digitalWrite(RED_LED, LOW);
        }
        

        // Free all
        //free (address);
        free (contents);
    }

    zmq_close (subscriber);
    zmq_ctx_destroy (context);
    return 0;
}
