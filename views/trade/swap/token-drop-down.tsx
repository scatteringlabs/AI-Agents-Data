import AvatarCard from "@/components/collections/avatar-card";
import {
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

// const TokenDropDown = () => {
//   return (
//     <FormControl fullWidth>
//       <Select
//         className="test-select"
//         labelId="select-label"
//         id="select"
//         placeholder="Select token"
//         value={activeToken}
//         onChange={(event) => {
//           setActiveToken(event.target.value);
//         }}
//         sx={selectStyle}
//         MenuProps={{
//           sx: {
//             "& .MuiList-root": {
//               bgcolor: "#0E111C",
//               padding: "0px",
//             },
//             "& .MuiMenu-list": {},
//           },
//         }}
//       >
//         {token?.map((t) => (
//           <MenuItem key={t.address} value={t.address} sx={menuItemStyle}>
//             <Stack
//               flexDirection="row"
//               alignItems="center"
//               justifyContent="space-between"
//             >
//               <AvatarCard
//                 // logoUrl={getTokenLogoURL({
//                 //   chainId,
//                 //   address: t.address,
//                 // })}
//                 logoUrl="/assets/images/tokens/eth.svg"
//                 chainId={chainId}
//                 size={40}
//               />
//               <Typography variant="h4">{t.symbol}</Typography>
//             </Stack>
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// };
