import React, { Component } from 'react';
import {Container} from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header.js';

export default props=>{

    return(
        <Container>
            <Head>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"/>
                <script src="/html2canvas.min.js"></script>
                    <script src="/canvas2image.js"></script>
            </Head>
            <Header page={props.page}/>
            {props.children}
        </Container>
    );
};