cpu = {
    _clock: {
        m: 0,
        t: 0
    },
    _registers: {
        a: 0, // 8 bit registers   
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,

        pc: 0, // 16 bit registers
        sp: 0,

        m: 0,
        t: 0
    },
    _opImplementation: {
        // load from register to register
        LDrb_b = () => {
            cpu._registers.b = cpu._registers.b;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        LDrb_c = () => {
            cpu._registers.b = cpu._registers.c;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        LDrb_d = () => {
            cpu._registers.b = cpu._registers.d;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        LDrb_e = () => {
            cpu._registers.b = cpu._registers.e;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        LDrb_h = () => {
            cpu._registers.b = cpu._registers.h;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        LDrb_l = () => {
            cpu._registers.b = cpu._registers.l;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        LDrb_a = () => {
            cpu._registers.b = cpu._registers.a;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },

        LDrc_b = () => {
            cpu._registers.c = cpu._registsers.b;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        LDrc_c = () => {
            //cpu.registers.c = cpu._registers.c;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        LDrc_d = () => {
            cpu.registers.c = cpu._registers.d;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        LDrc_e = () => {
            cpu._registers.c = cpu._registers.e;
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        },
        
        // add value from register to register A
        ADDra_e = () => {
            cpu._registers.a += cpu._registers.e;
            cpu._helpers.setFlags(cpu._registers.a);
            cpu._registers.a &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        // no operation
        NOP = () => {
            cpu._clock.m = 1;
            cpu._clock.t = 4;
        }
    },
    _helpers: {
        setFlags: (register, isSubOperation) => {
            cpu._registers.f = 0;
            if (!(register & 255)) { // check for if zero
                cpu._registers.f |= 0x80;
            // } else if (register > 15) {
            //     cpu._registers.f |= 0x20; //check for lower bit carry
            }
            if (register > 15) {
                cpu._registers.f |= 0x20;
            }
            if (register > 255) {
                cpu._registers.f |= 0x10 // check for carry
            }
            cpu._registers.f |= isSubOperation ? 0x40 : 0;
        }
    },
    _map: [],
    _cbmap: []
}

export default cpu;
