import { Close } from "@mui/icons-material";
import { Box, IconButton, IconButtonProps } from "@mui/material";

interface Props extends IconButtonProps {

}

export default function CloseButton(props: Props) {
  const { children, ...other} = props;

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1} >{children}</Box>
      <Box sx={{mr: -2, mt: -1}}>
          <IconButton color="error" {...other}>
            <Close/>
          </IconButton>
      </Box>
    </Box>
  )
}