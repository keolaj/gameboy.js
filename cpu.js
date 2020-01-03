const get16 = (reg1, reg2) => {
    let higher = reg1;
    let lower = reg2;
    higher << 8;
    reg2 &= 255;
    return higher + lower;
}

const cpu = {
    execute: true,
    cpuInterval: 0,
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
        f: 0,

        pc: 0, // 16 bit registers
        sp: 0,

        m: 0,
        t: 0
    },
    _opImplementation: {
        // load from register to register
        LDrra_b: () => {
            cpu._registers.a = cpu._registers.b;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrra_l: () => {
            cpu._registers.a = cpu._registers.l;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_b: () => {
            cpu._registers.b = cpu._registers.b;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_c: () => {
            cpu._registers.b = cpu._registers.c;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_d: () => {
            cpu._registers.b = cpu._registers.d;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_e: () => {
            cpu._registers.b = cpu._registers.e;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_h: () => {
            cpu._registers.b = cpu._registers.h;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_l: () => {
            cpu._registers.b = cpu._registers.l;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_a: () => {
            cpu._registers.b = cpu._registers.a;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_a: () => {
            cpu._registers.c = cpu._registers.a;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_b: () => {
            cpu._registers.c = cpu._registers.b;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_c: () => {
            //cpu.registers.c = cpu._registers.c;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_d: () => {
            cpu._registers.c = cpu._registers.d;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_e: () => {
            cpu._registers.c = cpu._registers.e;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrra_e: () => {
            cpu._registers.a = cpu._registers.e;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrra_h: () => {
            cpu._registers.a = cpu._registers.h;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrh_a: () => {
            cpu._registers.h = cpu._registers.a;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrd_a: () => {
            cpu._registers.d = cpu._registers.a;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        LDMEMa_de: () => {
            cpu._registers.a = memory.read8((cpu._registers.d << 8) + cpu._registers.e);
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        LDrn_a: () => {
            cpu._registers.a = memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_b: () => {
            cpu._registers.b = memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_c: () => {
            cpu._registers.c = memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_d: () => {
            cpu._registers.d = memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_e: () => {
            cpu._registers.e = memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_h: () => {
            cpu._registers.h = memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_l: () => {
            cpu._registers.l = memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        LDAIOC: () => {
            cpu._registers.a = memory.read8(0xFF00 + cpu._registers.c);
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        LDHa_n: () => {
            cpu._registers.a = memory.read8(memory.read8(cpu._registers.pc) + 0xFF00);
            cpu._registers.pc++;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        LDHn_a: () => {
            memory.write8((0xFF00 + memory.read8(cpu._registers.pc)), cpu._registers.a);
            cpu._registers.pc++;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        // 16 bit load
        LDhl_nn: () => {
            cpu._registers.l = memory.read8(cpu._registers.pc);
            cpu._registers.h = memory.read8(cpu._registers.pc + 1);
            cpu._registers.pc += 2;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },
        LDde_nn: () => {
            cpu._registers.e = memory.read8(cpu._registers.pc);
            cpu._registers.d = memory.read8(cpu._registers.pc + 1);
            cpu._registers.pc += 2;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },
        LDsp_nn: () => {
            cpu._registers.sp = memory.read16(cpu._registers.pc);
            cpu._registers.pc += 2;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },
        LDMEMhl_a: () => {
            memory.write8(((cpu._registers.h << 8) + cpu._registers.l), cpu._registers.a);
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDnn_a: () => {
            memory.write8(memory.read16(cpu._registers.pc), cpu._registers.a);
            cpu._registers.pc += 2;
            cpu._registers.m = 4;
            cpu._registers.t = 16;
        },

        LDhl_aDecHl: () => {
            memory.write8(((cpu._registers.h << 8) + cpu._registers.l), cpu._registers.a);
            cpu._registers.l = (cpu._registers.l - 1) & 255;
            if (cpu._registers.l == 255) {
                cpu._registers.h = (cpu._registers.h - 1) & 255;
            }
            cpu._registers.m = 2;
            cpu._registers.t = 8
        },
        LDhl_aIncHl: () => {
            memory.write8((cpu._registers.h << 8) + cpu._registers.l, cpu._registers.a);
            if (cpu._registers.l == 255) {
                cpu._registers.h++;
                cpu._registers.l = 0;

            } else {
                cpu._registers.l++;
            }
            cpu._registers.h &= 255;
            cpu._registers.l &= 255;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        LDHcandff00_a: () => {
            memory.write8(cpu._registers.c + 0xFF00, cpu._registers.a);
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        INCde: () => {
            if (cpu._registers.e == 255) {
                cpu._registers.e = 0;
                cpu._registers.d++;
            } else {
                cpu._registers.e++;
            }
            cpu._registers.d &= 255;
            cpu._registers.e &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        INChl: () => {
            if (cpu._registers.l == 255) {
                cpu._registers.l = 0;
                cpu._registers.h++;
            } else {
                cpu._registers.l++;
            }
            cpu._registers.h &= 255;
            cpu._registers.l &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        // jumps
        JRNZn: () => {
            let jumpOffset = memory.read8(cpu._registers.pc); // store jump offset
            if (jumpOffset > 127) {
                jumpOffset = -((~jumpOffset + 1) & 255); // sign jump offset byte
            }
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
            if ((cpu._registers.f & 0x80) == 0) {
                cpu._registers.pc += jumpOffset; // set program counter to perform jump 
                cpu._registers.m++; // imcrement clock because of jump
                cpu._registers.t += 4;
            }
        },
        JRZn: () => {
            let jumpOffset = memory.read8(cpu._registers.pc);
            if (jumpOffset > 127) {
                jumpOffset = -((~jumpOffset + 1) & 255);
            }
            cpu._registers.pc++;
            cpu._registers.m = 2;
            if ((cpu._registers.f & 0x80)) {
                cpu._registers.pc += jumpOffset;
                cpu._registers.m++;
            }
        },
        JRn: () => {
            let jumpOffset = memory.read8(cpu._registers.pc);
            if (jumpOffset > 127) {
                jumpOffset = -((~jumpOffset + 1) & 255);
            }
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8
            cpu._registers.pc += jumpOffset;
            cpu._registers.m++
            cpu._registers.t += 4;
        },
        JPn: () => {
            let jump = memory.read16(cpu._registers.pc);
            cpu._registers.pc = jump;
            cpu._registers.m++;
        },

        // calls
        CALLnn: () => {
            cpu._registers.sp -= 2;
            memory.write16(cpu._registers.sp, cpu._registers.pc + 2);
            cpu._registers.pc = memory.read16(cpu._registers.pc);
            cpu._registers.m = 6;
            cpu._registers.t = 24;
        },
        CALLNZnn: () => {
            cpu._registers.m = 3;
            cpu._registers.t = 12;
            if (cpu._registers.f & 0x80 == 0) {
                cpu._registers.sp -= 2;
                memory.write16(cpu._registers.sp, cpu._registers.pc + 2);
                cpu._registers.m = 6;
                cpu._registers.t = 20;
            }
        },

        // stack
        PUSHbc: () => {
            cpu._registers.sp--;
            memory.write8(cpu._registers.sp, cpu._registers.b);
            cpu._registers.sp--;
            memory.write8(cpu._registers.sp, cpu._registers.c);
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        POPbc: () => {
            cpu._registers.c = memory.read8(cpu._registers.sp);
            cpu._registers.sp++;
            cpu._registers.b = memory.read8(cpu._registers.sp);
            cpu._registers.sp++;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        // add value from register to register A
        ADDra_e: () => {
            cpu._registers.a += cpu._registers.e;
            cpu._helpers.setFlags(cpu._registers.a);
            cpu._registers.a &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        ADDmema_hl: () => {
            cpu._registers.a += memory.read8((cpu._registers.h << 8) + cpu._registers.l);
            cpu._registers.f = (cpu._registers.a > 255) ? 0x10 : 0;
            cpu._registers.a &= 255;
            if (!cpu._registers.a) {
                cpu._registers.f |= 0x80;
            }
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        SUBr_b: () => {
            cpu._registers.a -= cpu._registers.b;
            cpu._helpers.setFlags(cpu._registers.a, true);
            cpu._registers.a &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        SBCr_c: () => {
            cpu._registers.a -= cpu._registers.c;
            cpu._registers.a -= (cpu._registers.f & 0x10) ? 1 : 0;
            cpu._helpers.setFlags(cpu._registers.a, true);
            cpu._registers.a &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        DECr_a: () => {
            cpu._registers.a--;
            cpu._helpers.setFlags(cpu._registers.a, true);
            cpu._registers.a &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        DECr_b: () => {
            cpu._registers.b--;
            cpu._helpers.setFlags(cpu._registers.b, true); // there is some weird behavior with carry flag, look into it more
            cpu._registers.b &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        DECr_c: () => {
            cpu._registers.c--;
            cpu._helpers.setFlags(cpu._registers.c, true);
            cpu._registers.c &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        DECr_d: () => {
            cpu._registers.d--;
            cpu._helpers.setFlags(cpu._registers.d, true);
            cpu._registers.d &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        DECr_e: () => {
            cpu._registers.e--;
            cpu._helpers.setFlags(cpu._registers.e, true);
            cpu._registers.e &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        INCr_b: () => {
            cpu._registers.b++;
            cpu._helpers.setFlags(cpu._registers.b);
            cpu._registers.b &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        INCr_c: () => {
            cpu._registers.c++;
            cpu._helpers.setFlags(cpu._registers.c);
            cpu._registers.b &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        INCr_h: () => {
            cpu._registers.h++;
            cpu._helpers.setFlags(cpu._registers.h);
            cpu._registers.h &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        // bitwise operations
        XORa: () => {
            cpu._registers.a ^= cpu._registers.a;
            cpu._helpers.setFlags(cpu._registers.a);
            cpu._registers.a &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        // test bits
        BIT7b: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f |= (cpu._registers.b & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7c: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f |= (cpu._registers.c & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7d: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f |= (cpu._registers.d & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7e: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f |= (cpu._registers.e & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7h: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f |= (cpu._registers.h & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7l: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f |= (cpu._registers.l & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7a: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f |= (cpu._registers.a & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },

        // Returns
        RET: () => {
            cpu._registers.pc = memory.read16(cpu._registers.sp);
            cpu._registers.sp += 2;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        RETNZ: () => {
            cpu._registers.m = 1;
            cpu._registers.t = 4;
            if (cpu._registers.f & 0x80 == 0) {
                cpu._registers.pc = memory.read16(cpu._registers.sp);
                cpu._registers.sp += 2;
                cpu._registers.m += 2;
                //cpu._registers.t += 8;
            }
        },

        // rotates
        RLr_a: () => {
            let carry = cpu._registers.f & 0x10 ? 1 : 0;
            cpu._registers.a = cpu._registers.a << 1;
            cpu._registers.a += carry;
            cpu._helpers.setFlags(cpu._registers.a);
            cpu._registers.a &= 255;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        RLr_c: () => {
            let carry = cpu._registers.f & 0x10 ? 1 : 0;
            cpu._registers.c = cpu._registers.c << 1;
            cpu._registers.c += carry;
            cpu._helpers.setFlags(cpu._registers.c);
            cpu._registers.c &= 255
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        RRCa: () => {
            var ci = cpu._registers.a & 1 ? 0x80 : 0;
            var co = cpu._registers.a & 1 ? 0x10 : 0;
            cpu._registers.a = (cpu._registers.a >> 1) + ci;
            cpu._registers.a &= 255;
            cpu._registers.f = (cpu._registers.f & 0xEF) + co;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        CPn: () => {
            let i = cpu._registers.a
            i -= memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._helpers.setFlags(i, true);
            cpu._registers.f |= 0x10;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        CPhl: () => {
            let i = cpu._registers.a - memory.read8((cpu._registers.h << 8) + cpu._registers.l);
            cpu._helpers.setFlags(i, true);
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        // no operation
        NOP: () => {
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        // not implemented
        notImplemented: () => {
            console.log("not implemented");
            cpu.execute = false;
        }
    },
    _helpers: {
        setFlags: (register, isSubOperation) => {
            cpu._registers.f = 0;
            if (register == 0 || register & 255 == 0) { // check for if zero
                cpu._registers.f |= 0x80;
            }
            if (register > 15) {
                cpu._registers.f |= 0x20;
            }
            if (register > 255) {
                cpu._registers.f |= 0x10; // check for carry
            }
            if (register < 0) {
                cpu._registers.f |= 0x10;
            }
            cpu._registers.f |= isSubOperation ? 0x40 : 0; // if substitution operation set substitution flag
        },
        useCBMap: () => {
            let op = memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._registers.pc &= 65535;
            cpu._registers.m = 0;
            if (cpu._cbmap[op]) {
                //console.log("cbmap op: " + op.toString(16))
                cpu._cbmap[op]();
            } else {
                console.log("cb instruction not implemented: 0x" + op.toString(16));
                cpu.execute = false;
            }
        }
    },
    _map: [],
    _cbmap: [],

    frame: () => {
        var fclock = cpu._clock.m + 17556;
        do {
                let op = memory.read8(cpu._registers.pc++);
                if (cpu._map[op]) {
                    //console.log("memory location: 0x" + (cpu._registers.pc - 1).toString(16) + " instruction: 0x" + memory.read8(cpu._registers.pc - 1).toString(16));
                    cpu._map[op]();
                } else {
                    console.log("unimplemented instruction: 0x" + op.toString(16) + " at: 0x" + (cpu._registers.pc - 1).toString(16));
                    console.log(memory._bios);
                    console.log(cpu._registers);
                    cpu.execute = false;
                }
                //console.log("ticks: " + cpu._registers.m);
                cpu._registers.pc & 65535;
                cpu._clock.m += cpu._registers.m;
                gpu.step();
                if (cpu._registers.b < 0) {
                    console.log("weird register from instruction: 0x" + op.toString(16));
                    cpu.execute = false;
                }
                
        } while (cpu.execute && cpu._clock.m < fclock);

    },
    dispatcher: () => {
        cpu.cpuInterval = setInterval(() => {
            cpu.frame();
            if (cpu.execute === false) {
                clearInterval(cpu.cpuInterval);
            }
        }, 1);
    }
}
cpu._map = [
    cpu._opImplementation.NOP,
];

cpu._map[0x31] = cpu._opImplementation.LDsp_nn;
cpu._map[0xAF] = cpu._opImplementation.XORa;
cpu._map[0x21] = cpu._opImplementation.LDhl_nn;
cpu._map[0x32] = cpu._opImplementation.LDhl_aDecHl;
cpu._map[0xcb] = cpu._helpers.useCBMap;
cpu._map[0x20] = cpu._opImplementation.JRNZn;
cpu._map[0xE] = cpu._opImplementation.LDrn_c;
cpu._map[0xF] = cpu._opImplementation.RRCa;
cpu._map[0x3E] = cpu._opImplementation.LDrn_a;
cpu._map[0xE2] = cpu._opImplementation.LDHcandff00_a;
cpu._map[0xC] = cpu._opImplementation.INCr_c;
cpu._map[0xC0] = cpu._opImplementation.RETNZ;
cpu._map[0x77] = cpu._opImplementation.LDMEMhl_a;
cpu._map[0xE0] = cpu._opImplementation.LDHn_a;
cpu._map[0x11] = cpu._opImplementation.LDde_nn;
cpu._map[0x1A] = cpu._opImplementation.LDMEMa_de;
cpu._map[0xCD] = cpu._opImplementation.CALLnn;
cpu._map[0x4f] = cpu._opImplementation.LDrrc_a;
cpu._map[0x6] = cpu._opImplementation.LDrn_b;
cpu._map[0xC4] = cpu._opImplementation.CALLNZnn;
cpu._map[0xC5] = cpu._opImplementation.PUSHbc;
cpu._map[0x17] = cpu._opImplementation.RLr_a;
cpu._map[0xC1] = cpu._opImplementation.POPbc;
cpu._map[0x5] = cpu._opImplementation.DECr_b;
cpu._map[0x22] = cpu._opImplementation.LDhl_aIncHl;
cpu._map[0x23] = cpu._opImplementation.INChl;
cpu._map[0xC9] = cpu._opImplementation.RET;
cpu._map[0x13] = cpu._opImplementation.INCde;
cpu._map[0x7B] = cpu._opImplementation.LDrra_e;
cpu._map[0xFE] = cpu._opImplementation.CPn;
cpu._map[0xEA] = cpu._opImplementation.LDnn_a;
cpu._map[0x10] = () => {
    console.log("stopping at 0x" + cpu._registers.pc.toString(16));
}
cpu._map[0x99] = cpu._opImplementation.SBCr_c;
cpu._map[0x3D] = cpu._opImplementation.DECr_a;
cpu._map[0x28] = cpu._opImplementation.JRZn;
cpu._map[0xD] = cpu._opImplementation.DECr_c;
cpu._map[0x67] = cpu._opImplementation.LDrrh_a;
cpu._map[0x57] = cpu._opImplementation.LDrrd_a;
cpu._map[0x4] = cpu._opImplementation.INCr_b;
cpu._map[0x1E] = cpu._opImplementation.LDrn_e;
cpu._map[0xF0] = cpu._opImplementation.LDHa_n;
cpu._map[0x1D] = cpu._opImplementation.DECr_e;
cpu._map[0x24] = cpu._opImplementation.INCr_h;
cpu._map[0x7C] = cpu._opImplementation.LDrra_h;
cpu._map[0x90] = cpu._opImplementation.SUBr_b;
cpu._map[0x15] = cpu._opImplementation.DECr_d;
cpu._map[0x16] = cpu._opImplementation.LDrn_d;
cpu._map[0x18] = cpu._opImplementation.JRn;
cpu._map[0xF2] = cpu._opImplementation.LDAIOC;
cpu._map[0xBE] = cpu._opImplementation.CPhl;
cpu._map[0x7D] = cpu._opImplementation.LDrra_l;
cpu._map[0x78] = cpu._opImplementation.LDrra_b;
cpu._map[0x86] = cpu._opImplementation.ADDmema_hl;
cpu._map[0x2E] = cpu._opImplementation.LDrn_l;
cpu._map[0xC3] = cpu._opImplementation.JPn;

cpu._cbmap[0x7c] = cpu._opImplementation.BIT7h;
cpu._cbmap[0x11] = cpu._opImplementation.RLr_c;

document.getElementById("stepbutton").onclick = () => {
    cpu.execute = false;
    console.log("executing opcode: 0x" + memory.read8(cpu._registers.pc).toString(16));
    let op = memory.read8(cpu._registers.pc++);
    cpu._map[op]();
    cpu._registers.pc & 65535;
    cpu._clock.m += cpu._registers.m;
    console.log("register af: 0x" + ((cpu._registers.a << 8) + cpu._registers.f).toString(16));
    console.log("register bc: 0x" + ((cpu._registers.b << 8) + cpu._registers.c).toString(16));
    console.log("register de: 0x" + ((cpu._registers.d << 8) + cpu._registers.e).toString(16));
    console.log("register hl: 0x" + ((cpu._registers.h << 8) + cpu._registers.l).toString(16));
    console.log("register sp: 0x" + (cpu._registers.sp).toString(16));
    console.log("register pc: 0x" + (cpu._registers.pc).toString(16));
    console.log("prev instruction ticks: " + cpu._registers.m);
}

document.getElementById("resetbutton").onclick = () => {
    cpu.execute = false;
    clearInterval(cpu.cpuInterval);
    console.log(cpu._registers);
    console.log(memory._mem);
    cpu._registers = {
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
    }
    memory._mem = [];
}

document.getElementById("runbutton").onclick = cpu.dispatcher;