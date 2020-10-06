import React, { Component } from 'react';
import Layout from '../components/Layout.js'
import CandidateForm from '../components/CandidateForm.js';
class index extends Component{
    render(){
        return(
            <Layout page="candidates">
                <div style={{marginBottom:20}}></div>
                <CandidateForm/>
            </Layout>
        );
    }
}
export default index;