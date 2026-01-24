import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { Fragment } from 'react';
import type { MovieDetails } from 'rssa-study-template';

interface MovieDetailsCardProps {
    movieItem: MovieDetails;
    show: boolean;
    closeCallback: () => void;
    confirmCallback?: () => void;
    cancelCallback?: () => void;
    confirmText?: string;
    disableHide?: boolean;
}

const MovieDetailsCard: React.FC<MovieDetailsCardProps> = ({
    movieItem,
    show,
    closeCallback,
    confirmCallback,
    cancelCallback,
    confirmText = 'Close',
    disableHide = false,
}) => {
    const handleClose = () => {
        if (!disableHide) {
            closeCallback();
        }
    };

    const cleanTitle = DOMPurify.sanitize(movieItem.title);
    const parsedTitle = parse(cleanTitle);

    const parsePersonString = (castString: string) => {
        return castString.split('|').map((person, index) => (
            <span className="ml-2" key={index}>
                - {person}
            </span>
        ));
    };

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4"
                                >
                                    {parsedTitle}
                                </DialogTitle>
                                <div className="mt-2">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-shrink-0 mx-auto md:mx-0">
                                            <img
                                                src={movieItem.poster}
                                                alt={`Poster of the movie ${movieItem.title}`}
                                                className="rounded-lg shadow-md max-h-[400px] w-auto object-contain"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h5 className="text-xl font-bold mb-2">
                                                {movieItem.title} ({movieItem.year})
                                            </h5>
                                            <div className="max-h-64 overflow-y-auto mb-4 text-gray-700">
                                                {movieItem.description}
                                            </div>
                                            <div className="border-t pt-4 text-sm text-gray-600 max-h-48 overflow-y-auto">
                                                {movieItem.director && (
                                                    <div className="mb-2">
                                                        <strong>Director:</strong>
                                                        {parsePersonString(movieItem.director)}
                                                    </div>
                                                )}
                                                {movieItem.cast && (
                                                    <div>
                                                        <strong>Cast:</strong>
                                                        {parsePersonString(movieItem.cast)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-4">
                                    {cancelCallback && (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                            onClick={cancelCallback}
                                        >
                                            Close
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={confirmCallback || handleClose}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default MovieDetailsCard;
