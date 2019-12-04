import cpu from './cpu.js';
import memory from './memory.js';

const dispatcher = () => {
    memory.initBios();
    let execute = true;

    while (execute) {
        cpu.map[memory.read8(cpu._registers.pc++)]();
        cpu._registers.pc & 65535;
        cpu._clock.m += cpu._registers.m;
    }
}
