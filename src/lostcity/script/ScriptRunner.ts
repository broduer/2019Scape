import AllPackets from '#jagex/network/packetencoders/AllPackets.js';
import Player from '#lostcity/entity/Player.js';
import ServerScript, { SwitchTable } from './ServerScript.js';
import ServerScriptCommand from './ServerScriptCommands.js';
import ServerScriptList from './ServerScriptList.js';
import ServerScriptState, { GosubStackFrame } from './ServerScriptState.js';

export default class ScriptRunner {
    static MAP_LOBBY: boolean = false;

    static createState(script: ServerScript, self: Player | null = null, args: (number | string)[] = []): ServerScriptState {
        const state: ServerScriptState = new ServerScriptState(script);
        state._activePlayer = self;
        return state;
    }

    static execute(state: ServerScriptState): number {
        while (state.execution === ServerScriptState.RUNNING) {
            if (state.pc >= state.script.opcodes.length || state.pc < -1) {
                state.execution = ServerScriptState.ABORTED;
                break;
            }

            state.opcount++;
            ScriptRunner.executeInner(state, ServerScriptCommand.BY_ID[state.script.opcodes[++state.pc]]);
        }

        return state.execution;
    }

    static executeInner(state: ServerScriptState, command: ServerScriptCommand): void {
        if (typeof command === 'undefined') {
            return;
        }

        if (command.handler === null) {
            console.error('Unimplemented command: ' + command.name);
            state.execution = ServerScriptState.ABORTED;
            return;
        }

        command.handler(state);
    }
}