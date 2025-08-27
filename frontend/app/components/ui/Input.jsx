export default function Input({ size = "medium", type = "text", className, ...rest }) {

    const typeMapping = {
        text: "input",
        password: "input",
        email: "input",
        radio: "radio",
        checkbox: "checkbox",
        number: "input",
        range: "range",
        file: "file-input",
        search: "input"
    };
    const sizeMappingInput = {
        extraSmall: "input-xs",
        small: "input-sm",
        medium: "input-md",
        large: "input-lg",
        extraLarge: "input-xl",
    };
    const sizeMappingRadio = {
        extraSmall: "radio-xs",
        small: "radio-sm",
        medium: "radio-md",
        large: "radio-lg",
        extraLarge: "radio-xl",
    };
    const sizeMappingCheckBox = {
        extraSmall: "checkbox-xs",
        small: "checkbox-sm",
        medium: "checkbox-md",
        large: "checkbox-lg",
        extraLarge: "checkbox-xl",
    };
    const sizeMappingRange = {
        extraSmall: "range-xs",
        small: "range-sm",
        medium: "range-md",
        large: "range-lg",
        extraLarge: "range-xl",
    };
    const sizeMappingElement = {
        text: sizeMappingInput,
        password: sizeMappingInput,
        email: sizeMappingInput,
        radio: sizeMappingRadio,
        checkbox: sizeMappingCheckBox,
        number: sizeMappingInput,
        range: sizeMappingRange,
        file: sizeMappingInput,
        search: sizeMappingInput
    };
    const baseClass = `${typeMapping[type] || "input"} w-full inline-block`;
    const globalClass = `${baseClass} ${sizeMappingElement[type][size] || ""}  ${className || ""}`;
    return (
        <input
            className={globalClass}
            {...rest}
        />
    );
}
