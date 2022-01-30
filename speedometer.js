"use strict";
//
//  speedometer.js
//
//  Created by Alezia Kurdis, January 29th, 2022.
//  Copyright 2022 Alezia Kurdis.
//
//  Tool to record the maximal speed reached by the avatar.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
(function() { 


    var jsMainFileName = "speedometer.js";
    var ROOT = Script.resolvePath('').split(jsMainFileName)[0];
    var APP_NAME = "METER"; 
    var APP_ICON_INACTIVE = ROOT + "appicon_i.png";
    var APP_ICON_ACTIVE = ROOT + "appicon_a.png";

    var isRecording = false;
    var maxSpeed = 0;
    
    var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
    var button = tablet.addButton({
        text: APP_NAME,
        icon: APP_ICON_INACTIVE,
        activeIcon: APP_ICON_ACTIVE
    });  

    function clicked(){
    
        if (isRecording === false) {
            //Start Recoding
            maxSpeed = 0;
            Script.update.connect(myTimer);

            //button
            button.editProperties({
                "isActive": true,
                "text": APP_NAME
            });

            isRecording = true;
        } else {
            //on Stop Recoding
            Script.update.disconnect(myTimer);
            button.editProperties({
                "isActive": false
            });
            isRecording = false;
        }
    }
    
    button.clicked.connect(clicked);
    
    function myTimer(deltaTime) {
        var avatarVelocity = Vec3.length(MyAvatar.velocity);
        if (avatarVelocity > maxSpeed) {
            maxSpeed = avatarVelocity;
            var kmPerHour = Math.round(maxSpeed * 3.6);
            var formatedMaxSpeed = kmPerHour + " km/h";

            //button
            button.editProperties({
                "text": formatedMaxSpeed
            });

        }
    }

    function cleanup() {
        button.clicked.disconnect(clicked);
        tablet.removeButton(button);
        if (isRecording) {
            Script.update.disconnect(myTimer);
        }
        Script.scriptEnding.disconnect(cleanup);
    }

    Script.scriptEnding.connect(cleanup);    

}());
