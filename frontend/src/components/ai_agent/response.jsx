import ReactMarkdown from "react-markdown";

const Response = function({text}){
	return(
		<ReactMarkdown
			components={{
				code({ node, inline, className, children, ...props }) {
					if (inline) {
					return (
						<code
						className="bg-gray-200 text-red-500 px-1 rounded"
						{...props}
						>
						{children}
						</code>
					);
					} else {
					return (
						<pre
						className="text-xs bg-gray-800 text-rose-200 px-2 p-1 rounded overflow-x-auto"
						{...props}
						>
						<code>{children}</code>
						</pre>
					);
					}
				},
				}}
			>
			{text}
		</ReactMarkdown>
	)
}

export default Response;
