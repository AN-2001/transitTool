
function HeaderRow( {Data} ) {
    let AsTags = Data.map((V) => {
        return <th key={V}>{V}</th>
    });
    return <tr key={AsTags}>{AsTags}</tr>
}


function DataRow( {Data} ) {
    let AsTags = Data.Inner.map((V) => {
        return <td key={V}>{V}</td>
    });
    function HandleCallback(Event)
    {
        Data.Callback(Event, Data.RowID);
    }

    return <tr className='StationRow' onClick={HandleCallback} key={AsTags}>{AsTags}</tr>
}


function DataTable( {Props} ) {
    let AsTags = Props.Body.map((V) => {
        return <DataRow key = {V.RouteID} Data={{
            Callback: Props.Callback,
            RowID: V.RouteID,
            Inner: V.Data}} />;
    });

    return <table id='StationTable' >
                 <>
                 <thead><HeaderRow Data={Props.Header} /></thead>
                 <tbody>{AsTags}</tbody>
                 </>
           </table>
}


export { DataTable };
