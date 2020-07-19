import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import {createLogEntry} from './Api';

const LogEntryForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { handleSubmit, register } = useForm();
    
    const onSubmit = async(data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createLogEntry(data);
            onClose();
        } catch (error) {
            console.error(error);
            setError(error.message);
            setLoading(false);
        }
    };

    return(
        <form className="cm-entry-form" onSubmit={handleSubmit(onSubmit)}>
            {error ? <h3 className="cm-error">{error}</h3> : null}
            <label htmlFor="title">Title</label>
            <input name="title" ref={register} required/>

            <label htmlFor="comments">Comments</label>
            <textarea name="comments" rows={3} ref={register} />
            
            <label htmlFor="description">Description</label>
            <input name="description" ref={register} />
            
            <label htmlFor="image">Image</label>
            <input name="image" ref={register} />
            
            <label htmlFor="visitDate">Visit Date</label>
            <input name="visitDate" type="date" ref={register} required/>
            
            <button disabled={loading}>{loading ? 'Creating Entry...': 'Create Entry'}</button>
        </form>
    )
}

export default LogEntryForm;