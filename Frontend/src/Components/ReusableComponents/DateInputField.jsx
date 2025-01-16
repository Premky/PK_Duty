import React, { useState, useEffect } from "react";

const DateInputField = ({ name, placeholder = "YYYY-MM-DD", onChange, value }) => {
    const [formattedValue, setFormattedValue] = useState(value || "");

    useEffect(() => {
        setFormattedValue(value || ""); // Sync with external changes to value
    }, [value]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
        let formatted = inputValue;

        if (inputValue.length > 4) {
            const year = inputValue.slice(0, 4);
            const month = inputValue.slice(4, 6);
            formatted = `${year}-${month}`;
        }
        if (inputValue.length > 6) {
            const year = inputValue.slice(0, 4);
            let month = inputValue.slice(4, 6);
            let day = inputValue.slice(6, 8);

            // Validate month
            if (parseInt(month, 10) > 12) {
                month = "12";
            }
            // Validate day
            if (parseInt(day, 10) > 31) {
                day = "31";
            }

            formatted = `${year}-${month}-${day}`;
        }

        formatted = formatted.slice(0, 10); // Limit to yyyy-mm-dd
        setFormattedValue(formatted);

        if (onChange) {
            onChange({ target: { name, value: formatted } });
        }
    };

    return (
        <input
            type="text"
            name={name}
            value={formattedValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            maxLength={10}
        />
    );
};

export default DateInputField;
