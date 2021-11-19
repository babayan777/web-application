import React, {useContext} from 'react';
import Button from "@material-ui/core/Button";
import {Box, Typography} from "@mui/material";
import {HomeContext} from "../App";

function Home() {
    const {handleSetToken} = useContext(HomeContext);

    return (
        <Box sx={{display:"flex", justifyContent:"space-between"}}>
            <Typography variant={"h3"}>HOME PAGE</Typography>
            <Button color="primary" variant="contained" onClick={ () =>  handleSetToken("") }>Sign out</Button>
        </Box>
    )
}

export default Home
