import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import { forwardRef, useRef } from "react";

export const PasswordField = forwardRef((props, ref) => {
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef(null);
  const mergeRef = useMergeRefs(inputRef, ref);
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };
  return (
    <FormControl>
      <FormLabel htmlFor="password">{props.name}</FormLabel>
      <InputGroup>
        <InputRightElement background="transparent">
          <IconButton
            size="10px"
            aria-label={isOpen ? "Mask password" : "Reveal password"}
            icon={
              isOpen ? (
                <span className="material-symbols-outlined">visibility</span>
              ) : (
                <span className="material-symbols-outlined">
                  visibility_off
                </span>
              )
            }
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input
          id="password"
          ref={mergeRef}
          name="password"
          type={isOpen ? "text" : "password"}
          autoComplete="current-password"
          required
          {...props}
        />
      </InputGroup>
    </FormControl>
  );
});
PasswordField.displayName = "PasswordField";

PasswordField.defaultProps = {
  name: "Password",
};
