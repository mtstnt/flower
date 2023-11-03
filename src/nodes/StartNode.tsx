import { Handle, Position } from "reactflow";

export function StartNode() {
    return (
        <>
            <div className="w-[150px] h-[150px] outline outline-5 outline-black bg-yellow-300 flex justify-center items-center" style={{ borderRadius: "100%" }}>
                <h1 className="text-2xl font-bold">START</h1>
            </div>
            <Handle type="source" className="p-1" position={Position.Bottom} />
        </>
    )
}
