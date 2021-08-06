import React, { Fragment, useEffect, useState, useRef } from 'react';
import useInputState from './hooks/useInputState';
import mapboxgl from 'mapbox-gl';
import headerBg from './images/pattern-bg.png';
import axios from 'axios';
import arrow from './images/icon-arrow.svg';
import styled from 'styled-components';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Header = styled.div`
    position: absolute; 
    z-index: 1;
`;
const MapContainer = styled.div`
    width: 100vw;
    height: calc(100vh - 255px);
`;
const Title = styled.div`
    position: relative;
    top: 3rem;
    color: white;
    font-weight: 500;
    font-size: 28px;
    z-index: 2;
`;
const Search = styled.form`
    position: relative;
    top: 4.5rem;
    display: flex;
    justify-content: center;
    z-index: 2;
`;
const Input = styled.input`
    border: none;
    padding: 0.4rem 2rem;
    width: 400px;
    height: 40px;
    border-radius: 15px 0 0 15px;
    outline: none;
    font-size: 18px;
    font-family: inherit;
    &:hover{
        cursor: pointer;
    }
    @media (max-width: 700px){
        width: 50%;
    }
`;
const Button = styled.button`
    border: none;
    background-color: hsl(0, 0%, 17%);
    width: 55px;
    border-radius: 0 15px 15px 0;
    transition: all 0.15s ease-in-out;
    &:hover{
        background-color: hsl(0, 0%, 25%);
        cursor: pointer;
    }
`;
const Result = styled.div`
    width: 75%;
    height: fit-content;
    background-color: white;
    position: relative;
    top: 6.5rem;
    z-index: 2;
    border-radius: 15px;
    display: flex;
    justify-content: space-evenly;
    align-items: start;
    padding: 2rem 0;
    margin: 0 auto;
    @media (max-width: 950px){
        flex-direction: column;
        padding: 1rem 0;
        width: 45%;
    }
    @media (max-width: 600px){
        flex-direction: column;
        padding: 1rem 0;
        width: 70%;
    }
`;
const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding:0rem 2rem;
    width: 100%;
    border-right: 1px solid hsl(0, 0%, 85%);
    text-align: left;
@media (max-width: 950px){
    align-items: center;
    padding: 0.8rem 0;

}
`;

const DataTitle = styled.div`
    margin-bottom: 0.6rem;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    color: hsl(0, 0%, 59%); 
`;
const Data = styled.div`
    margin-bottom: auto;
    font-size: 20px;
    font-weight: 500;
`;


const IpTracker = () => {
    const [ipAddress, changeIpAddress, resetIpAddress, setIpAddress] = useInputState('');
    const [data, setData] = useState();

    const ref = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        axios.get(`https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_IPIFY_APIKEY}`)
            .then(res => setData(res.data))
    }, [])

    useEffect(() => {
        if (ref.current && !map) {
            const map = new mapboxgl.Map({
                container: ref.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [data.location.lng, data.location.lat],
                zoom: 14
            });
            const marker = new mapboxgl.Marker({
                color: "hsl(0, 0%, 17%)",
                scale: "1.5"
            }).setLngLat([data.location.lng, data.location.lat])
                .addTo(map);

            setMap(map);
            setMarker(marker);
        }
        if (map && data) {
            map.flyTo({ center: [data.location.lng, data.location.lat] })
            marker.setLngLat([data.location.lng, data.location.lat])
                .addTo(map);
        }
    }, [ref, map, data]);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setIpAddress(ipAddress);
        axios.get(`https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_IPIFY_APIKEY}&ipAddress=${ipAddress}`)
            .then(res => setData(res.data))
            .catch(err => console.log(err))
        resetIpAddress();
        console.log(data)
    }

    return (
        <div>
            {data &&
                <Fragment>
                    <Header>
                        <img style={{ width: "100vw", height: "250px" }} src={headerBg} alt="header-background" />
                        <MapContainer ref={ref} />
                    </Header>
                    <Title>IP Adderss Tracker</Title>
                    <Search onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            onChange={changeIpAddress}
                            value={ipAddress}
                            placeholder="Search for any IP address"
                        />
                        <Button type="submit">
                            <img src={arrow} alt="arrow-icon" />
                        </Button>
                    </Search>
                    <Result>
                        <Section>
                            <DataTitle>IP ADDERSS</DataTitle>
                            <Data>{data.ip}</Data>
                        </Section>
                        <Section>
                            <DataTitle>LOCATION</DataTitle>
                            <Data>{data.location.city}, {data.location.country} {data.location.geonameId}</Data>
                        </Section>
                        <Section>
                            <DataTitle>TIMEZONE</DataTitle>
                            <Data>UTC {data.location.timezone}</Data>
                        </Section>
                        <Section style={{ borderRight: "none" }}>
                            <DataTitle>ISP</DataTitle>
                            <Data>{data.isp}</Data>
                        </Section>
                    </Result>
                </Fragment>
            }
        </div>
    );
};

export default IpTracker;