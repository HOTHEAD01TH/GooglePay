export const Balance = ({ value }) => {
    return (
        <div className="flex flex-col space-y-2">
            <div className="text-gray-600 text-lg">
                Available Balance
            </div>
            <div className="text-4xl font-bold text-gray-900">
                ₹ {value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
        </div>
    )
}