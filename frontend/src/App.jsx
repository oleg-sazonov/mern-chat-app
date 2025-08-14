function App() {
    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-base-100 p-4">
                <div className="flex flex-col gap-6 w-full max-w-md">
                    <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
                        Responsive
                    </button>

                    <div className="collapse bg-base-100 border-base-300 border">
                        <input type="checkbox" />
                        <div className="collapse-title font-semibold">
                            How do I create an account?
                        </div>
                        <div className="collapse-content text-sm">
                            Click the "Sign Up" button in the top right corner
                            and follow the registration process.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
