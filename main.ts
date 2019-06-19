
/**
 * Interaction for MeArm and SG90 servos
 */

enum Gripper {
    //% block="offen"
    Open = 0,
    //% block="geschlossen"
    Closed = 180
}

/**
 * User-defined blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace meArm {


    class meArm {
        bottomPin: AnalogPin
        leftPin: AnalogPin
        rightPin: AnalogPin
        gripperPin: AnalogPin

        bottomValue: number
        leftValue: number
        rightValue: number

        constructor(bottomPin: AnalogPin, leftPin: AnalogPin, rightPin: AnalogPin, gripperPin: AnalogPin) {
            this.bottomPin = bottomPin
            this.leftPin = leftPin
            this.rightPin = rightPin
            this.gripperPin = gripperPin

            initServo(this.bottomPin)
            initServo(this.leftPin)
            initServo(this.rightPin)
        }
        move(bottom: number, left: number, right: number) {
            this.bottomValue = bottom
            this.leftValue = left
            this.rightValue = right

            moveServo(this.bottomPin, bottom)
            moveServo(this.leftPin, left)
            moveServo(this.rightPin, right)
        }
        moveGripper(value: number) {
            deinitServo(this.bottomPin)
            deinitServo(this.leftPin)
            deinitServo(this.rightPin)

            initServo(this.gripperPin)
            moveServo(this.gripperPin, value)
            control.waitMicros(100000)
            deinitServo(this.gripperPin)

            initServo(this.bottomPin)
            initServo(this.leftPin)
            initServo(this.rightPin)
            move(this.bottomValue, this.leftValue, this.rightValue)
        }
    }
    let m: meArm
    /**
     * MeArm initialisieren
     * @param bottomPin Servomotor (unten) an Pin initialisieren
     * @param leftPin Servomotor (links) an Pin initialisieren
     * @param rightPin Servomotor (rechts) an Pin initialisieren
     * @param gripperPin Servomotor (Greifer) an Pin initialisieren
     */
    //% blockId=MeArm_init
    //% block="MeArm initialisieren. Verwendete Pins:|unten: %bottomPin|links: %leftPin|rechts: %rightPin|Greifer: %gripperPin"
    export function init(bottomPin: AnalogPin, leftPin: AnalogPin, rightPin: AnalogPin, gripperPin: AnalogPin) {
        m = new meArm(bottomPin, leftPin, rightPin, gripperPin)
    }

    /**
     * Servo initialisieren
     * @param pin Servomotor an Pin initialisieren
     */
    //% blockId=servo_init
    //% block="Servo an Pin %pin|initialisieren"
    //% blockHidden=true
    export function initServo(pin: AnalogPin) {
        pins.analogSetPeriod(pin, 20000)
    }

    /**
     * Servo deinitialisieren
     * @param pin Servomotor an Pin deinitialisieren
     */
    //% blockId=servo_deInit
    //% block="Servo an Pin %pin|deinitialisieren"
    //% blockHidden=true
    export function deinitServo(pin: AnalogPin) {
        pins.analogWritePin(pin, 0)
    }

    /**
     * Servomotor auf bestimmten Winkel fahren
     * @param pin Servo-Pin
     * @param value Servo-Winkel von 0 bis 180 Grad
     */
    //% blockId=servo_move
    //% block="Servo an %pin|auf %value|Grad bewegen"
    //% blockHidden=true
    //% value.min=0 value.max=180 value.defl=90
    export function moveServo(pin: AnalogPin, value: number) {
        if (value > 180) { value = 180 }
        if (value < 0) { value = 0 }
        let servo = (value * 5) / 9 + 27
        pins.analogWritePin(pin, servo)
    }

    /**
     * MeArm an bestimmte Winkelkombination fahren
     * @param bottom Winkel für unteren Motor
     * @param left Winkel für unteren Motor
     * @param right Winkel für unteren Motor
     */
    //% blockId=MeArm_move
    //% block="MeArm auf %bottom|, %left|, %right| bewegen"
    //% bottom.min=0 bottom.max=180 bottom.defl=90
    //% left.min=0 left.max=180 left.defl=90
    //% right.min=0 right.max=180 right.defl=90
    export function move(bottom: number, left: number, right: number) {
        m.move(bottom, left, right)
    }

    /**
     * MeArm Greifer bewegen
     * @param status Status des Greifers
     */
    //% blockId=MeArm_gripper
    //% block="MeArm Greifer auf %status|stellen"
    export function greifer(status: Gripper) {
        m.moveGripper(status)
    }
}
