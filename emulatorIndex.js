import cpu from './cpu.js';
import memory from './memory.js';

const dispatcher = () => {
    memory.initBios();
    let execute = true;

    while (execute) {
        let op = memory.read16(cpu._registers.pc);
    }
}
