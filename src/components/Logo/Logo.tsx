import { motion } from "framer-motion"

function Logo() {
  return (
    <motion.svg 
      id="eesJnTfdoOq1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 100 300 100"
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
    >
      <g transform="matrix(.325702 0.945473-.945473 0.325702 315.770385-67.903091)">
        <g transform="translate(-2.866859-86.542678)">
          <g transform="translate(.000011 0)">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              d="M136.60266,146.390937l3.830246,11.919214l29.932376-6.939972c1.194561,3.717315,5.185728,6.857505,8.036514,6.775481c2.70625-.415921,5.724656-2.808955,8.058275-5.735688"
              transform="matrix(.305942-.95205 0.95205 0.305942-8.497005 416.945218)"
              fill="none" 
              stroke="#e0c2fc"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <motion.path
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: 1}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          d="M38.175469,256.107866l41.958042-7.287801l16.983412,10.628041l8.480881-19.130476l6.695431,28.240226l9.546231-39.475585l10.821651,45.279947l4.464969-6.271304-8.317452-27.773284l27.225712-11.235359c-.194314-2.817087,1.019317-7.052507,3.07037-8.188433c2.114334-1.637221,6.922237-2.07256,9.578884-1.144064c16.534184,5.079658,26.890054,33.60549,24.178,54.612444l6.02589-45.279947l4.46362,30.365835l8.927241-10.628041l49.5462,7.287801"
          transform="matrix(.326869-.94507 0.94507 0.326869-135.1553 287.100034)"
          fill="none"
          stroke="#e0c2fc"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </motion.svg>
  )
}

export default Logo
