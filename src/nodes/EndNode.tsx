import { Handle, Position } from "reactflow";

export function EndNode() {
  return (
    <>
      <Handle type="target" className="p-1" position={Position.Top} />
      <div
        className="w-[150px] h-[150px] outline outline-5 outline-black bg-purple-300 flex justify-center items-center"
        style={{ borderRadius: "100%" }}
      >
        <h1 className="text-2xl font-bold">END</h1>
      </div>
    </>
  );
}
