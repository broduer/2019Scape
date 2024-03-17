import AllPackets from '#jagex/network/packetencoders/AllPackets.js';
import ScriptRunner from '../ScriptRunner.js';
import ServerScript, { SwitchTable } from '../ServerScript.js';
import ServerScriptCommand from '../ServerScriptCommands.js';
import ServerScriptList from '../ServerScriptList.js';
import ServerScriptState, { GosubStackFrame } from '../ServerScriptState.js';

ServerScriptCommand.IF_OPENTOP.handler = (state: ServerScriptState): void => {
    const ifId: number = state.popInt();
    AllPackets.ifOpenTop(state._activePlayer!.client!, ifId);
}

ServerScriptCommand.IF_OPENSUB.handler = (state: ServerScriptState): void => {
    const [ifCom, child, type] = state.popInts(3);
    const ifId: number = ifCom >> 16;
    const comId: number = ifCom & 0xFFFF;
    AllPackets.ifOpenSub(state._activePlayer!.client!, ifId, comId, child, type);
}