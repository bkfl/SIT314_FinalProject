import useSWR, { mutate } from 'swr'
import { Table, Form, FormCheck } from 'react-bootstrap'
import axios from 'axios'

const fetchWithToken = (url, token) => {
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
}

const sendControl = (nodeId, state, token, mutate) => {
    fetch(`http://localhost:4000/devices/${nodeId}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        body: JSON.stringify({ state })
        })
    .then(() => {
        mutate();
    })
}

export default function Devices(props) {
    const { data, error, mutate } = useSWR(['http://localhost:4000/devices', props.token], fetchWithToken)
    
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    
    data.devices.sort( (a, b) => {
        if (a.nodeId < b.nodeId) return -1;
        if (b.nodeId < a.nodeId) return 1;
        return 0;
    })

    // render data
    return(
        <div>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Node ID</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {
                    data.devices.map(({ nodeId, name, location, requestedState}) => (
                        <tr key={nodeId}>
                            <td>{nodeId}</td>
                            <td>{name}</td>
                            <td>{location}</td>
                            <td>
                                <Form>
                                    <Form.Switch id={nodeId} label={requestedState ? "On" : "Off"} checked={requestedState} onChange={() => sendControl(nodeId, !requestedState, props.token, mutate)}/>
                                </Form>        
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>
        </div>
    )
}