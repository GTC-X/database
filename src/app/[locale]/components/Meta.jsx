'use client';

const Meta = ({ title, description }) => {
    return (
        <head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
        </head>
    );
};

export default Meta;
