import { styled } from "@mui/material";
import Button from "@mui/material/Button";

export const MinWidthButton = styled(Button)({
    minWidth: 'unset', // デフォルトの最小幅を無効に
    width: 'auto',     // コンテンツに合わせた幅に
});