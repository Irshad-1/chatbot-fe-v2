import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Signup } from "../Signup";
import { Login } from "../Login";
import { Details } from "../Details";
import PageNotFound from "../error-pages/PageNotFound";
import QuestionFeed from "../QuestionFeed";
import QuestionAnswerDisplay from "../QuestionAnswerDisplay";

function SiteRoutes() {
    return (
        <>

            <Routes>
                <Route path="/page-not-found" element={<PageNotFound />} />
                <Route path="*" element={<Navigate to="/page-not-found" />} />
                <Route path='/' element={<Details />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<Login />} />
                <Route path="/feed-question" element={<QuestionFeed />} />
                <Route path="/question-answer-table" element={<QuestionAnswerDisplay />} />
            </Routes>

        </>
    );
}

export default SiteRoutes;
