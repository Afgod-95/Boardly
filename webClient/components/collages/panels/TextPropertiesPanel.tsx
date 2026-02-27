import { useState } from "react"
import fabric from 'fabric'


const TextPropertiesPanel = ({ activeObject, fabricRef }: {
    activeObject: fabric.Object,
    fabricRef: React.RefObject<fabric.Canvas | null>
}) => {
    const obj = activeObject as fabric.Textbox
    const [fontSize, setFontSize] = useState<number>((obj.fontSize as number) ?? 24)
    const [color, setColor] = useState<string>((obj.fill as string) ?? '#111111')
    const [bold, setBold] = useState(obj.fontWeight === 'bold')
    const [italic, setItalic] = useState(obj.fontStyle === 'italic')

    const apply = (props: Partial<fabric.Textbox>) => {
        obj.set(props)
        fabricRef.current?.renderAll()
    }

    return (
        <div className="p-4 space-y-4 border-b">
            <h3 className="font-bold text-sm">Text Properties</h3>

            {/* Font size */}
            <div className="space-y-1">
                <label className="text-xs text-gray-500">Font Size</label>
                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min={8} max={120}
                        value={fontSize}
                        onChange={(e) => {
                            const val = Number(e.target.value)
                            setFontSize(val)
                            apply({ fontSize: val })
                        }}
                        className="flex-1"
                    />
                    <span className="text-sm w-8 text-right">{fontSize}</span>
                </div>
            </div>

            {/* Font color */}
            <div className="space-y-1">
                <label className="text-xs text-gray-500">Color</label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                            setColor(e.target.value)
                            apply({ fill: e.target.value })
                        }}
                        className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                    />
                    <span className="text-xs text-gray-500">{color}</span>
                </div>
            </div>

            {/* Bold / Italic */}
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        const next = !bold
                        setBold(next)
                        apply({ fontWeight: next ? 'bold' : 'normal' })
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors
                        ${bold ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-200 hover:border-gray-400'}`}
                >
                    B
                </button>
                <button
                    onClick={() => {
                        const next = !italic
                        setItalic(next)
                        apply({ fontStyle: next ? 'italic' : 'normal' })
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm italic border transition-colors
                        ${italic ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-200 hover:border-gray-400'}`}
                >
                    I
                </button>
            </div>
        </div>
    )
}

export default TextPropertiesPanel