import { styled } from "styled-components"

const StyledButton = styled.button`
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 4px;
  padding: 8px 16px; /* Reduced padding */
  font-size: 14px; /* Reduced font size */
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0 8px 0 0 ; /* Add some margin around the button */

  &:hover {
    background-color: #000;
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;



export default function PrimaryBtn({children}){
    return(
        <StyledButton>{children}</StyledButton>
    )
}