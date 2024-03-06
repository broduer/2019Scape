import fs from 'fs';

import Packet from '#jagex3/io/Packet.js';
import RandomAccessFile from '#jagex3/io/RandomAccessFile.js';

import Js5Archive from '#jagex3/js5/Js5Archive.js';

function packArchive(name: string, archive: number, regenerate: boolean = false): void {
    if (!regenerate && fs.existsSync(`data/pack/client.${name}.js5`)) {
        return;
    }

    const files: string[] = fs.readdirSync(`data/cache/1730/${archive}`);
    const groups: number[] = files.map((f: string): number => parseInt(f.replace('.dat', ''))).sort((a, b): number => a - b);

    const js5: RandomAccessFile = new RandomAccessFile(`data/pack/client.${name}.js5`, 'w');
    const info: Packet = Packet.alloc(groups.length * 8);

    const idx255: Uint8Array = fs.readFileSync(`data/cache/1730/255/${archive}.dat`);
    js5.write(idx255, 0, idx255.length);

    for (const group of groups) {
        const data: Uint8Array = fs.readFileSync(`data/cache/1730/${archive}/${group}.dat`);
        js5.write(data, 0, data.length - 2);
        info.p4(data.length - 2);
    }

    js5.write(info.data, 0, info.pos);
}

console.time('js5');
for (let i: number = 0; i < Js5Archive.values.length; i++) {
    const type: Js5Archive = Js5Archive.values[i];
    packArchive(type.name, type.id);
}
console.timeEnd('js5');