import { useState } from 'react';

export default initialVal => {
    const [input, setInput] = useState(initialVal)
    const handleInputChange = evt => {
        setInput(evt.target.value);
    };
    const resetInput = () => {
        setInput("");
    };
    return [input, handleInputChange, resetInput, setInput];
}