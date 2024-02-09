import React from "react";
import Layout from "../layouts/Layout";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";
import LandingPage from "../components/LandindPage";

export default function PrivateRoute() {
    const { token, user } = useAuth()

    return token ? 
    ( (user) ? <Outlet/> : 
    <LandingPage />
    ) : 
    <Navigate to="/login"/>
}