package com.project2.convert;

import com.project2.entities.data.MotelRoom;
import com.project2.entities.data.Report;
import com.project2.entities.data.RoomHasConvenient;
import com.project2.entities.data.Tenant;
import com.project2.entities.dto.MotelRoomDTO;
import com.project2.repository.RoomHasConvenientRepository;
import com.project2.repository.TenantRepository;
import com.project2.service.ReportService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MotelRoomConvert implements Convert<MotelRoom, MotelRoomDTO> {

    private final ReportService reportService;

    private final TenantRepository tenantRepository;

    private final RoomHasConvenientRepository roomHasConvenientRepository;

    @Override
    public MotelRoomDTO toDTO(MotelRoom motelRoom, String email) throws Exception {
        Integer personIn = Math.toIntExact(tenantRepository.count(Example.of(Tenant.builder()
                .room(motelRoom).status(true).build())));

        List<Report> reports = reportService.findAllByRoom(motelRoom.getId(), email);
        List<Integer> rates = new ArrayList<>();
        Float ratings = 0F;
        for (Report r : reports) {
            if (!rates.contains(r.getUser().getId()) && !r.getUser().getId().equals(motelRoom.getHost().getId())){
                rates.add(r.getUser().getId());
                ratings += r.getRate();
            }
        }

        List<RoomHasConvenient> roomHasConvenientList = roomHasConvenientRepository.findByRoomAndDeletedFalse(motelRoom);

        return MotelRoomDTO.builder()
                .motelRoom(motelRoom)
                .tenantList(tenantRepository.findAllByRoomAndDeletedFalse(motelRoom))
                .tenantRented(tenantRepository.findAllByRoomAndDeletedTrueAndStatusTrue(motelRoom))
                .personIn(personIn)
                .personAsk(Math.toIntExact(tenantRepository.count(Example.of(Tenant.builder()
                        .room(motelRoom).status(false).build()))))
                .reportList(reportService.findAllByRoom(motelRoom.getId(), email))
                .convenientList(roomHasConvenientList != null ? roomHasConvenientList.stream()
                        .map(RoomHasConvenient::getConvenient).collect(Collectors.toList()) : null)
                .countReport(reports.size())
                .countRated(rates.isEmpty() ? 0 : rates.size())
                .ratings(ratings.equals(0F) ? 0F : (ratings / rates.size()))
                .build();
    }

    @Override
    public List<MotelRoomDTO> toDTOToShowAll(List<MotelRoom> motelRooms, Integer sizePage, boolean isNotFull,
                                             String email) throws Exception {
        List<MotelRoomDTO> rs = new ArrayList<>();
        if (motelRooms != null) {
            int index = 0;
            for (MotelRoom room : motelRooms) {
                Integer personIn = Math.toIntExact(tenantRepository.count(Example.of(Tenant.builder()
                        .room(room).status(true).build())));
                if (isNotFull && personIn.equals(room.getMaxPerson()))
                    continue;
                List<Report> reports = reportService.findAllByRoom(room.getId(), email);
                List<Integer> rates = new ArrayList<>();
                Float ratings = 0F;
                for (Report r : reports) {
                    if (!rates.contains(r.getUser().getId()) && !r.getUser().getId().equals(room.getHost().getId())) {
                        rates.add(r.getUser().getId());
                        ratings += r.getRate();
                    }
                }

                rs.add(MotelRoomDTO.builder()
                        .motelRoom(room)
                        .personIn(personIn)
                        .personAsk(Math.toIntExact(tenantRepository.count(Example.of(Tenant.builder()
                                .room(room).status(false).build()))))
                        .countReport(reports.size())
                        .countRated(rates.isEmpty() ? 0 : rates.size())
                        .ratings(ratings.equals(0F) ? 0F : (ratings / rates.size()))
                        .build());
                if (++index == sizePage)
                    break;
            }

        }
        return rs.isEmpty() ? null : rs;
    }
}
