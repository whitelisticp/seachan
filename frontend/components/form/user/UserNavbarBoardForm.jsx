import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { compareValues } from '../../../utils/compareValues'

export const UserNavbarBoardForm = ({ actor, user, setUser, setShowNavbarBoardsForm, listedBoards }) => {
    const [isLoading, setLoading] = useState(false);
    const { register, handleSubmit } = useForm();
    const handleAddNavbarBoard = async (data) => {
        setLoading(true);
        const addNavbarBoardResult = await actor.addNavbarBoard(data.board);
        if (addNavbarBoardResult['ok']) {
            setUser(addNavbarBoardResult['ok'])
        }
        else { alert("error", addNavbarBoardResult['err']) }
        setLoading(false);
        setShowNavbarBoardsForm(false);
    };
    return (
        <form style={{ display: "inline" }} onSubmit={handleSubmit(handleAddNavbarBoard)} autoComplete="off">
            <select name="board" {...register('board')}>
                {listedBoards.sort(compareValues('abbreviation')).map(
                    board => {
                        if (user?.navbarBoards.includes(board.abbreviation) == false) {
                            return (<option key={board.abbreviation} value={board.abbreviation}>{"/" + board.abbreviation + "/ - " + board.name}</option>)
                        }
                    })}
            </select>
            <button className="success horizontal-margin" disabled={isLoading} >{!isLoading ? "Add" : "Adding..."}</button>
        </form >
    );
};