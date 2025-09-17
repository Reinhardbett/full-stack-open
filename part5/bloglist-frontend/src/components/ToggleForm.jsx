import { useState } from 'react'

const ToggleForm = ({ buttonLabel, children }) => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            {!visible && (
                <button onClick={() => setVisible(true)}>{buttonLabel}</button>
            )}

            {visible && (
                <div>
                    {children}
                    <button onClick={() => setVisible(false)}>Cancel</button>
                </div>
            )}
        </div>
    )
}

export default ToggleForm